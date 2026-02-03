
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading, isAdmin } = useAuth();
    const navigate = useNavigate();

    if (loading) return null; // Or a loader

    // Check if user is logged in AND is an admin
    if (!user || !isAdmin) {
        toast.error("Unauthorized access");
        // Redirect to home if not authorized, but inside useEffect is better. 
        // For a component restriction, returning null (and maybe redirecting) is key.
        return null;
    }

    return <>{children}</>;
};

export default AdminRoute;
