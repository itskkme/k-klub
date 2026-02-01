import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, Settings, Menu, X, Mail, LayoutDashboard } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      gsap.fromTo(
        searchInputRef.current,
        { width: 0, opacity: 0 },
        { width: "200px", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim();

      // Check if search query matches a category name
      const categories = ["Jackets", "Shirts", "T-Shirts", "Pants", "Sweaters", "Blazers", "Footwear", "Accessories"];
      const matchedCategory = categories.find(cat =>
        cat.toLowerCase() === query.toLowerCase()
      );

      if (matchedCategory) {
        // Navigate to products page with category filter
        navigate(`/products?category=${encodeURIComponent(matchedCategory)}&t=${Date.now()}`);
      } else {
        // Regular search
        navigate(`/products?search=${encodeURIComponent(query)}`);
      }

      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl md:text-3xl tracking-wider text-foreground hover:text-primary transition-colors"
          >
            K-KLUB
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-secondary border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all input-luxury"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/wishlist"
              className={`nav-link flex items-center space-x-1 ${isActive("/wishlist") ? "text-primary" : ""
                }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm">Wishlist</span>
            </Link>
            <Link
              to="/settings"
              className={`nav-link flex items-center space-x-1 ${isActive("/settings") ? "text-primary" : ""
                }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </Link>
            <Link
              to="/contact"
              className={`nav-link flex items-center space-x-1 ${isActive("/contact") ? "text-primary" : ""
                }`}
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Contact</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link flex items-center space-x-1 ${isActive("/admin") ? "text-primary" : ""
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-sm">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="p-2 text-muted-foreground hover:text-foreground">
              <Heart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground input-luxury"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                Settings
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-foreground hover:text-primary transition-colors font-bold text-red-500"
              >
                Admin (Debug)
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
