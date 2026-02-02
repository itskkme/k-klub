import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { mockProducts, priceRanges, sortOptions, Product } from "@/data/mockProducts";
import { supabase } from "@/lib/supabase";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert snake_case to camelCase
        const productsData = data?.map((p: any) => ({
          id: p.id,
          name: p.name || "Untitled Product",
          brand: p.brand || "Generic",
          price: Number(p.price) || 0,
          category: p.category || "Uncategorized",
          images: p.images || [],
          description: p.description || "",
          colors: p.colors || [],
          sizes: p.sizes || [],
          buyLinks: p.buy_links || [],
          showOnHomepage: p.show_on_homepage,
          isTopPick: p.is_top_pick,
          isNewArrival: p.is_new_arrival,
          trending: p.is_top_pick,
          newArrival: p.is_new_arrival,
          gender: p.gender || "Unisex",
        })) || [];

        // Use Supabase products or fallback to mock
        setProducts(productsData.length > 0 ? productsData : mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(mockProducts); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [selectedGender, setSelectedGender] = useState("All");

  // Read initial values from URL and update when URL changes
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const gender = searchParams.get("gender");

    // Always update category based on URL (default to "All" if not in URL)
    setSelectedCategory(category || "All");
    setSortBy(sort || "featured");
    setSelectedGender(gender || "All");
  }, [searchParams]); // Re-run when URL params change

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    const searchQuery = searchParams.get("search")?.toLowerCase();
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.brand.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery) ||
          product.gender?.toLowerCase().includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Gender filter
    if (selectedGender !== "All") {
      result = result.filter((product) => {
        // Handle case sensitivity and 'Unisex' logic if needed
        const pGender = product.gender || "Unisex";
        return pGender === selectedGender || pGender === "Unisex";
      });
    }

    // Brand filter
    if (selectedBrand !== "All Brands") {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    // Price filter
    const priceRange = priceRanges[selectedPriceRange];
    if (priceRange) {
      result = result.filter(
        (product) => product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "new":
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case "popular":
        result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      default:
        // Featured - keep original order but prioritize trending
        result.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return 0;
        });
    }

    return result;
  }, [selectedCategory, selectedBrand, selectedPriceRange, selectedGender, sortBy, searchParams, products]);

  const searchQuery = searchParams.get("search");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">
              {searchQuery
                ? `SEARCH RESULTS`
                : selectedCategory !== "All"
                  ? selectedCategory.toUpperCase()
                  : "ALL PRODUCTS"}
            </h1>
            <p className="text-muted-foreground">
              {searchQuery && (
                <span>
                  Showing results for "{searchQuery}" •{" "}
                </span>
              )}
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Mobile Filter & Sort Bar */}
          <div className="flex items-center gap-4 mb-6 md:hidden">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground input-luxury"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Sort Bar */}
          <div className="hidden md:flex items-center justify-end gap-4 mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm input-luxury"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              isMobileFiltersOpen={isMobileFiltersOpen}
              setIsMobileFiltersOpen={setIsMobileFiltersOpen}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-secondary/50 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No products found</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
