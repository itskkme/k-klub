import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { categories, brands, priceRanges, sortOptions } from "@/data/mockProducts";

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedPriceRange: number;
  setSelectedPriceRange: (index: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (open: boolean) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
}

const ProductFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedPriceRange,
  setSelectedPriceRange,
  sortBy,
  setSortBy,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  selectedGender,
  setSelectedGender,
}: ProductFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    gender: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All Brands");
    setSelectedPriceRange(0);
    setSortBy("featured");
    setSelectedGender("All");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedBrand !== "All Brands" ||
    selectedPriceRange !== 0 ||
    selectedGender !== "All";

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By (Mobile only) */}
      <div className="md:hidden">
        <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-foreground font-medium mb-3"
        >
          <span>Category</span>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between text-foreground font-medium mb-3"
        >
          <span>Brand</span>
          {expandedSections.brand ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === brand
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-foreground font-medium mb-3"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <button
                key={range.label}
                onClick={() => setSelectedPriceRange(index)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedPriceRange === index
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gender Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex items-center justify-between text-foreground font-medium mb-3"
        >
          <span>Gender</span>
          {expandedSections.gender ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.gender && (
          <div className="space-y-2">
            {["All", "Unisex", "Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedGender === gender
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-card p-6 rounded-lg border border-border">
          <h2 className="font-display text-xl text-foreground mb-6">Filters</h2>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-card p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-foreground">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
