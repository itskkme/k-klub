import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Star, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/products/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockProducts } from "@/data/mockProducts";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Load products from Supabase
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts(mockProducts);
      } else {
        // Convert snake_case to camelCase
        const productsData = data?.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          category: p.category,
          images: p.images || [],
          description: p.description,
          colors: p.colors || [],
          sizes: p.sizes || [],
          buyLinks: p.buy_links || [],
          showOnHomepage: p.show_on_homepage,
          isTopPick: p.is_top_pick,
          isNewArrival: p.is_new_arrival,
          trending: p.is_top_pick, // Map for compatibility
          newArrival: p.is_new_arrival, // Map for compatibility
        })) || [];

        setProducts(productsData.length > 0 ? productsData : mockProducts);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by display flags
  const trendingProducts = products.filter((p) => p.isTopPick || p.trending).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival || p.newArrival).slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.fromTo(
        ".hero-text",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          delay: 0.3,
        }
      );

      // Hero image parallax
      gsap.to(".hero-image", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Featured section animation
      gsap.fromTo(
        ".featured-title",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
          },
        }
      );

      // Categories animation
      gsap.fromTo(
        ".category-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const categoryCards = [
    {
      title: "Jackets",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      link: "/products?category=Jackets",
    },
    {
      title: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
      link: "/products?category=Footwear",
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop",
      link: "/products?category=Accessories",
    },
    {
      title: "Shirts",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      link: "/products?category=Shirts",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&h=1080&fit=crop"
            alt="Hero background"
            className="hero-image w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        {/* Hero Content */}
        <div ref={heroTextRef} className="relative z-10 container mx-auto px-4 text-center">
          <p className="hero-text text-primary font-medium tracking-widest mb-4 text-sm md:text-base">
            CURATED MEN'S FASHION
          </p>
          <h1 className="hero-text font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight">
            STYLE LIKE YOUR
            <br />
            <span className="text-gradient-red">FAVORITE INFLUENCERS</span>
          </h1>
          <p className="hero-text text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Wear What Your Favorite Influencers Wear.
            We Curate the Style. You Choose Where to Buy.
          </p>
          <h3 className="hero-text mb-10">
            <span className="text-gradient-red text-2xl font-display">Discover Once. Shop Anywhere.</span>
          </h3>
          <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg btn-red transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              <span>Join K-Klub</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              SHOP BY CATEGORY
            </h2>
            <p className="text-muted-foreground">
              Find your perfect style across our curated collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoryCards.map((category, index) => (
              <Link
                key={category.title}
                to={category.link}
                className="category-card group relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-display text-xl md:text-2xl text-foreground">
                    {category.title}
                  </h3>
                  <span className="text-primary text-sm flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section ref={featuredRef} className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-primary text-sm font-medium tracking-wider">TRENDING NOW</span>
              </div>
              <h2 className="featured-title font-display text-4xl md:text-5xl text-foreground">
                TOP PICKS
              </h2>
            </div>
            <Link
              to="/products?sort=popular"
              className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <Link
            to="/products?sort=popular"
            className="flex md:hidden items-center justify-center gap-2 text-primary mt-8"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-accent text-sm font-medium tracking-wider">JUST DROPPED</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                NEW ARRIVALS
              </h2>
            </div>
            <Link
              to="/products?sort=new"
              className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">PREMIUM BRANDS</h3>
              <p className="text-muted-foreground text-sm">
                Handpicked selections from the world's finest fashion houses
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">BEST PRICES</h3>
              <p className="text-muted-foreground text-sm">
                Compare prices across multiple retailers instantly
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">CURATED STYLE</h3>
              <p className="text-muted-foreground text-sm">
                Expert selections tailored for the modern gentleman
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
