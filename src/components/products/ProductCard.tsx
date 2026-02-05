import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/data/mockProducts";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
        }
      );
    }
  }, [index]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    setIsWishlisted(!isWishlisted);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current && imageRef.current) {
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current && imageRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div
        ref={cardRef}
        className="group relative bg-card rounded-lg overflow-hidden border border-border transition-shadow duration-300 hover:shadow-[var(--shadow-elevated)]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        {/* Product Image Container */}
        <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <img
            ref={imageRef}
            src={product.images && product.images.length > 0 ? product.images[0] : (product.image || "")}
            alt={product.name}
            className="w-full h-full object-contain bg-white"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.trending && (
            <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
              TRENDING
            </span>
          )}
          {product.newArrival && (
            <span className="px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded">
              NEW
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300 wishlist-heart ${isWishlisted ? "active" : ""
            }`}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
          />
        </button>

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <span className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg">
            Quick View
          </span>
        </div>
        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
