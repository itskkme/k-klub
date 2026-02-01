import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  User,
  Heart,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  Globe,
  Mail,
  Trash2,
  LogIn,
} from "lucide-react";
import gsap from "gsap";
import Navbar from "@/components/layout/Navbar";
import { mockProducts } from "@/data/mockProducts";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSaving, setIsSaving] = useState(false);



  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          console.log("Fetching user data for:", user.uid);
          // Use select instead of single to inspect results better
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.uid);

          if (error) {
            console.error("Error fetching user data:", error);
            // Quietly handle "no results" error as a new user state
            if (error.code !== 'PGRST116') {
              toast.error("Error loading profile: " + error.message);
            }
            // Fallback to auth data
            setProfileData(prev => ({ ...prev, email: user.email || "" }));
          } else if (data && data.length > 0) {
            const userData = data[0];
            console.log("SUCCESS: User data loaded:", userData);
            setProfileData({
              name: userData.name || "",
              email: userData.email || user.email || "",
              phone: userData.phone || "",
            });
          } else {
            // No data found - this is normal for new users
            setProfileData(prev => ({ ...prev, email: user.email || "" }));
          }
        } catch (error: any) {
          console.error("UNEXPECTED ERROR:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        id: user.uid, // Explicitly sending ID
        email: user.email,
        name: profileData.name,
        phone: profileData.phone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .upsert(payload);

      if (error) {
        throw error;
      }

      toast.success("Profile saved successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    deals: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem('k-klub-wishlist') || '[]');
      setWishlistItems(wishlist);
    };
    loadWishlist();

    // Listen for storage changes (when wishlist is updated in another tab/component)
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  const handleRemoveFromWishlist = (itemId: string) => {
    const updated = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updated);
    localStorage.setItem('k-klub-wishlist', JSON.stringify(updated));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".settings-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main ref={containerRef} className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-8">
            SETTINGS
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">


            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="border-t border-border mt-4 pt-4">
                  <button
                    onClick={() => user ? handleLogout() : navigate("/auth")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${user
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-primary hover:bg-primary/10"
                      }`}
                  >
                    {user ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    <span>{user ? "Log Out" : "Log In"}</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="settings-card bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display text-2xl text-foreground mb-6">
                      PERSONAL INFORMATION
                    </h2>

                    <div className="space-y-4">
                      {user ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({ ...profileData, name: e.target.value })
                              }
                              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              disabled
                              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-muted-foreground input-luxury cursor-not-allowed opacity-70"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) =>
                                setProfileData({ ...profileData, phone: e.target.value })
                              }
                              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">Please log in to view and edit your profile information.</p>
                          <button
                            onClick={() => navigate("/auth")}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg btn-red"
                          >
                            Log In
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg btn-red disabled:opacity-70"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="settings-card bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display text-2xl text-foreground mb-6">
                      CHANGE PASSWORD
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                        />
                      </div>
                    </div>
                    <button className="mt-6 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <div className="settings-card bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-2xl text-foreground">
                        YOUR WISHLIST
                      </h2>
                      <span className="text-muted-foreground">
                        {wishlistItems.length} items
                      </span>
                    </div>

                    {wishlistItems.length > 0 ? (
                      <div className="space-y-4">
                        {wishlistItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-secondary rounded-lg"
                          >
                            <img
                              src={item.images?.[0] || item.image || ''}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground uppercase">
                                {item.brand}
                              </p>
                              <p className="text-foreground font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-primary font-semibold">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/product/${item.id}`}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleRemoveFromWishlist(item.id)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Your wishlist is empty</p>
                        <Link
                          to="/products"
                          className="text-primary hover:underline mt-2 inline-block"
                        >
                          Start shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="settings-card bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display text-2xl text-foreground mb-6">
                      NOTIFICATION PREFERENCES
                    </h2>

                    <div className="space-y-4">
                      {[
                        {
                          key: "email",
                          icon: Mail,
                          title: "Email Notifications",
                          description: "Receive updates via email",
                        },
                        {
                          key: "push",
                          icon: Bell,
                          title: "Push Notifications",
                          description: "Get alerts on your device",
                        },
                        {
                          key: "deals",
                          icon: Globe,
                          title: "Deals & Promotions",
                          description: "Be notified about special offers",
                        },
                        {
                          key: "newArrivals",
                          icon: ChevronRight,
                          title: "New Arrivals",
                          description: "Get updates on new products",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-foreground font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                [item.key]:
                                  !notifications[item.key as keyof typeof notifications],
                              })
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications]
                              ? "bg-primary"
                              : "bg-border"
                              }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications]
                                ? "translate-x-7"
                                : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="settings-card bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display text-2xl text-foreground mb-6">
                      PRIVACY & SECURITY
                    </h2>

                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div className="text-left">
                            <p className="text-foreground font-medium">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <div className="text-left">
                            <p className="text-foreground font-medium">
                              Connected Accounts
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Manage linked social accounts
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div className="text-left">
                            <p className="text-foreground font-medium">
                              Download Your Data
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Export your account information
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  <div className="settings-card bg-card border border-destructive/30 rounded-xl p-6">
                    <h2 className="font-display text-2xl text-destructive mb-4">
                      DANGER ZONE
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Permanently delete your account and all associated data. This action
                      cannot be undone.
                    </p>
                    <button className="px-6 py-3 border border-destructive text-destructive font-semibold rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
