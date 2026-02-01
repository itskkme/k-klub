
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-secondary/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-display text-2xl font-bold text-foreground">K-KLUB</h3>
                        <p className="text-muted-foreground text-sm">
                            Premium fashion for the modern gentleman. Curated styles for every occasion.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/products?category=Jackets" className="hover:text-primary transition-colors">Jackets</Link></li>
                            <li><Link to="/products?category=Shirts" className="hover:text-primary transition-colors">Shirts</Link></li>
                            <li><Link to="/products?category=Footwear" className="hover:text-primary transition-colors">Footwear</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
                            <li><Link to="/settings" className="hover:text-primary transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><span className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} K-Klub. All rights reserved.</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
