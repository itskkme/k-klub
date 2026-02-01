import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import gsap from "gsap";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const { login, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Animate form fields with stagger
      gsap.fromTo(
        ".form-field",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Animate button
      gsap.fromTo(
        ".submit-btn",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.6 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLogin]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          await login(formData.email, formData.password);
          toast.success("Welcome back!");
          navigate("/");
        } else {
          console.log("Starting signup...");
          await signUp(formData.email, formData.password, formData.name);
          console.log("Signup completed, showing toast...");

          // Show alert to ensure user sees the message
          alert("✅ Verification link sent to your email!\n\nPlease check your inbox or spam folder and verify your email before signing in.");

          toast.success("Verification link sent to your email! Please check your inbox or spam folder.", {
            duration: 10000,
          });
          console.log("Toast called");
          // Switch to login mode
          setIsLogin(true);
          // Clear form
          setFormData({ name: "", email: "", password: "" });
          // Don't navigate - keep user on auth page to see the message
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        toast.error(error.message || "An error occurred");
        // Optional: Map Firebase error codes to user-friendly messages
        if (error.code === 'auth/email-already-in-use') {
          setErrors(prev => ({ ...prev, email: "Email already in use" }));
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div ref={containerRef} className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <span className="font-display text-4xl tracking-wider text-primary">K-KLUB</span>
        </Link>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-elevated)]">
          <h1
            ref={titleRef}
            className="font-display text-3xl text-center text-foreground mb-2"
          >
            {isLogin ? "WELCOME BACK" : "JOIN THE KLUB"}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin
              ? "Sign in to access your curated style"
              : "Create an account to discover exclusive fashion"}
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Sign Up only) */}
            {!isLogin && (
              <div className="form-field">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground input-luxury ${errors.name ? "border-destructive" : "border-border"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="form-field">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground input-luxury ${errors.email ? "border-destructive" : "border-border"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground input-luxury ${errors.password ? "border-destructive" : "border-border"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="form-field text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 btn-red transition-all hover:gap-4"
            >
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          By continuing, you agree to our{" "}
          <button className="text-primary hover:underline">Terms of Service</button> and{" "}
          <button className="text-primary hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
