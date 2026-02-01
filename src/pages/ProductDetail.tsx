
import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Share2,
  ChevronLeft,
  ExternalLink,
  X,
  Ruler,
  Check,
} from "lucide-react";
import gsap from "gsap";
import Navbar from "@/components/layout/Navbar";
import { mockProducts } from "@/data/mockProducts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gallery State
  const [selectedImage, setSelectedImage] = useState("");

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Convert snake_case to camelCase
          const productData = {
            id: data.id,
            name: data.name,
            brand: data.brand,
            price: data.price,
            category: data.category,
            images: data.images || [],
            description: data.description,
            colors: data.colors || [],
            sizes: data.sizes || [],
            buyLinks: data.buy_links || [],
            showOnHomepage: data.show_on_homepage,
            isTopPick: data.is_top_pick,
            isNewArrival: data.is_new_arrival,
          };
          setProduct(productData);
        } else {
          // Fallback to mock products
          const mockProduct = mockProducts.find((p) => p.id === id);
          setProduct(mockProduct || null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to mock products
        const mockProduct = mockProducts.find((p) => p.id === id);
        setProduct(mockProduct || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
      const wishlist = JSON.parse(localStorage.getItem('k-klub-wishlist') || '[]');
      setIsWishlisted(wishlist.some((item: any) => item.id === product.id));
    }
  }, [product]);

  const toggleWishlist = () => {
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem('k-klub-wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.id === product.id);

    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter((item: any) => item.id !== product.id);
      localStorage.setItem('k-klub-wishlist', JSON.stringify(updated));
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      wishlist.push(product);
      localStorage.setItem('k-klub-wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        const firstSize = product.sizes[0];
        setSelectedSize(typeof firstSize === 'string' ? firstSize : firstSize.size || "");
      }

      // Set initial main image
      // Priority: 1. selectedImage (if already set), 2. images[0], 3. image (legacy)
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0]);
      } else if (product.image) {
        setSelectedImage(product.image);
      }
    }
  }, [product]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-image",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".product-info",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(
        ".product-detail",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.4,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [id, loading]); // Re-run animation when loading finishes

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isImageZoomed) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: `Check out this ${product?.name} from K-Klub`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Helper to ensure we have an array of images
  const displayImages = product.images && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main ref={containerRef} className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image Gallery */}
            <div className="flex flex-col gap-4">
              <div
                ref={imageRef}
                className="product-image relative aspect-[3/4] md:aspect-auto md:h-[600px] w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-secondary cursor-zoom-in"
                onMouseEnter={() => setIsImageZoomed(true)}
                onMouseLeave={() => setIsImageZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: isImageZoomed ? "scale(1.5)" : "scale(1)",
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                />

                {/* Back Button */}
                <Link
                  to="/products"
                  className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.trending && (
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                      TRENDING
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Slider */}
              {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {displayImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <p className="text-primary text-sm font-medium tracking-wider mb-2">
                {product.brand.toUpperCase()}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                {product.name.toUpperCase()}
              </h1>

              <div className="product-detail flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.sizes?.find((s: any) => s.size === selectedSize)?.price || product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <p className="product-detail text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="product-detail mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Color: {product.colors && product.colors[selectedColor]}
                </label>
                <div className="flex gap-3">
                  {product.colors && product.colors.map((color: string, index: number) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(index)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-all ${selectedColor === index
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="product-detail mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Size: {selectedSize}
                  </label>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes && product.sizes.map((sizeObj: any) => {
                    const sizeLabel = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                    return (
                      <button
                        key={sizeLabel}
                        onClick={() => setSelectedSize(sizeLabel)}
                        className={`min-w-[48px] px-4 py-2 border rounded-lg text-sm transition-all ${selectedSize === sizeLabel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-foreground"
                          }`}
                      >
                        {sizeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="product-detail flex gap-4 mb-8">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/auth");
                      return;
                    }
                    setShowBuyModal(true);
                  }}
                  className="flex-1 py-4 bg-primary text-primary-foreground font-semibold rounded-lg btn-red flex items-center justify-center gap-2 transition-all"
                >
                  <span>Buy Now</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-4 border rounded-lg transition-all wishlist-heart ${isWishlisted
                    ? "border-red-500 bg-red-500/10 active"
                    : "border-border hover:border-foreground"
                    }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
                      }`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 border border-border rounded-lg hover:border-foreground transition-colors"
                >
                  <Share2 className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Product Details */}
              <div className="product-detail border-t border-border pt-8">
                <h3 className="font-display text-xl text-foreground mb-4">PRODUCT DETAILS</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Available in multiple colors and sizes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Compare prices from {product.buyLinks ? product.buyLinks.length : 0} retailers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Buy Now Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowBuyModal(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-2xl text-foreground mb-2">BUY NOW</h2>
            <p className="text-muted-foreground mb-6">
              Choose a retailer to purchase this item
            </p>

            <div className="space-y-3">
              {product.buyLinks && product.buyLinks.length > 0 ? (
                product.buyLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-secondary border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-foreground">{link.platform}</p>
                      <p className="text-sm text-muted-foreground">Shop now</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No purchasing options available at the moment.</p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              Prices and availability may vary. K-Klub earns a commission from purchases.
            </p>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSizeChart(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-lg animate-scale-in">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-2xl text-foreground mb-6">SIZE GUIDE</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-foreground">Size</th>
                    <th className="py-3 px-4 text-left text-foreground">Chest (in)</th>
                    <th className="py-3 px-4 text-left text-foreground">Waist (in)</th>
                    <th className="py-3 px-4 text-left text-foreground">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">S</td>
                    <td className="py-3 px-4">36-38</td>
                    <td className="py-3 px-4">28-30</td>
                    <td className="py-3 px-4">27</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">M</td>
                    <td className="py-3 px-4">38-40</td>
                    <td className="py-3 px-4">30-32</td>
                    <td className="py-3 px-4">28</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">L</td>
                    <td className="py-3 px-4">40-42</td>
                    <td className="py-3 px-4">32-34</td>
                    <td className="py-3 px-4">29</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">XL</td>
                    <td className="py-3 px-4">42-44</td>
                    <td className="py-3 px-4">34-36</td>
                    <td className="py-3 px-4">30</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">XXL</td>
                    <td className="py-3 px-4">44-46</td>
                    <td className="py-3 px-4">36-38</td>
                    <td className="py-3 px-4">31</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Measurements are approximate. For the best fit, we recommend comparing to a garment you already own.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
