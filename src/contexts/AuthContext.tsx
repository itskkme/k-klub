

import { createContext, useContext, useEffect, useState, useRef } from "react";
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const isSigningUp = useRef(false);

    useEffect(() => {
        let isMounted = true;

        // 1. GLOBAL SAFETY NET: Force app to load after 1 second no matter what
        const safetyTimeout = setTimeout(() => {
            if (isMounted) {
                console.warn("Global Auth timeout. Forcefully loading app.");
                setLoading(false);
            }
        }, 1000);


        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth State Changed:", currentUser ? "User Logged In" : "No User");
            if (!isMounted) return;

            if (currentUser) {
                // Check if email is verified (skip during signup process and for admin)
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
                const isUserAdmin = currentUser.email === adminEmail;

                if (!currentUser.emailVerified && !isSigningUp.current && !isUserAdmin) {
                    // TEMPORARY: Allow unverified users
                    // console.log("User email not verified, signing out...");
                    // await signOut(auth);
                    // setUser(null);
                    // setIsAdmin(false);
                    // clearTimeout(safetyTimeout);
                    // if (isMounted) setLoading(false);
                    // return;
                }

                setIsAdmin(isUserAdmin);
                console.log("Admin check - User email:", currentUser.email, "Admin email:", adminEmail, "Is Admin:", isUserAdmin);
                setUser(currentUser);
            } else {
                setUser(null);
                if (isMounted) setIsAdmin(false);
            }

            // 3. Clear the global timeout only when we are ACTUALLY done
            clearTimeout(safetyTimeout);
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
            clearTimeout(safetyTimeout);
        }
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        isSigningUp.current = true;
        try {
            console.log("1. Creating user account...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("2. User created:", userCredential.user.email);

            // Create user record in Supabase
            console.log("3. Creating Supabase user record...");
            const { error: supabaseError } = await supabase
                .from('users')
                .insert([
                    {
                        id: userCredential.user.uid,
                        name: name,
                        email: email,
                        created_at: new Date().toISOString(),
                    }
                ]);

            if (supabaseError) {
                console.error("Supabase error:", supabaseError);
                // Continue anyway since auth succeeded
            }
            console.log("4. Supabase user record created");

            // Send verification email
            console.log("5. Sending verification email...");
            await sendEmailVerification(userCredential.user);
            console.log("6. Verification email sent");

            // Sign out the user until they verify their email
            console.log("7. Signing out user...");
            await signOut(auth);
            console.log("8. User signed out");

            console.log("Signup process completed successfully");
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        } finally {
            isSigningUp.current = false;
        }
    };

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Check if email is verified (skip for admin)
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const isAdmin = userCredential.user.email === adminEmail;

        if (!userCredential.user.emailVerified && !isAdmin) {
            // TEMPORARY: Allow login without verification for debugging/MVP
            // await signOut(auth);
            // throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
            console.warn("User email not verified, but allowing access.");
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user exists in Supabase, if not create
        const { data } = await supabase
            .from('users')
            .select('id')
            .eq('id', result.user.uid)
            .single();

        if (!data) {
            await supabase
                .from('users')
                .insert([
                    {
                        id: result.user.uid,
                        name: result.user.displayName,
                        email: result.user.email,
                        created_at: new Date().toISOString(),
                    }
                ]);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, signUp, login, logout, googleSignIn }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-primary animate-pulse mb-4">
                            K-KLUB
                        </h1>
                        <div className="flex gap-2 justify-center">
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
