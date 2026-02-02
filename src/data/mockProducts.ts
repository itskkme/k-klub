
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image?: string; // Deprecated
  category: string;
  colors: string[];
  sizes: { size: string; price: number }[];
  description: string;
  buyLinks: {
    store: string;
    url: string;
    price: number;
  }[];
  trending?: boolean;
  newArrival?: boolean;
  gender?: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Leather Jacket",
    brand: "AllSaints",
    price: 299,
    originalPrice: 399,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop"
    ],
    category: "Jackets",
    colors: ["Black", "Brown", "Navy"],
    sizes: [{ size: "S", price: 299 }, { size: "M", price: 309 }, { size: "L", price: 319 }, { size: "XL", price: 329 }],
    description: "Premium leather jacket with a timeless design. Features high-quality hardware and a comfortable fit.",
    buyLinks: [
      { store: "Amazon", url: "https://amazon.com", price: 299 },
      { store: "Myntra", url: "https://myntra.com", price: 285 },
      { store: "AllSaints", url: "https://allsaints.com", price: 319 },
    ],
    trending: true,
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    brand: "Hugo Boss",
    price: 89,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop"],
    category: "Pants",
    colors: ["Khaki", "Navy", "Olive", "Black"],
    sizes: [{ size: "28", price: 89 }, { size: "30", price: 89 }, { size: "32", price: 95 }, { size: "34", price: 95 }, { size: "36", price: 99 }],
    description: "Tailored slim fit chinos made from premium cotton. Perfect for both casual and semi-formal occasions.",
    buyLinks: [
      { store: "Amazon", url: "https://amazon.com", price: 89 },
      { store: "Hugo Boss", url: "https://hugoboss.com", price: 99 },
    ],
    newArrival: true,
  },
  {
    id: "3",
    name: "Premium Oxford Shirt",
    brand: "Ralph Lauren",
    price: 129,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop"],
    category: "Shirts",
    colors: ["White", "Light Blue", "Pink"],
    sizes: [{ size: "S", price: 129 }, { size: "M", price: 129 }, { size: "L", price: 139 }, { size: "XL", price: 139 }, { size: "XXL", price: 149 }],
    description: "Classic Oxford shirt with button-down collar. Made from 100% premium cotton.",
    buyLinks: [
      { store: "Myntra", url: "https://myntra.com", price: 119 },
      { store: "Ralph Lauren", url: "https://ralphlauren.com", price: 145 },
    ],
    trending: true,
  },
  {
    id: "4",
    name: "Cashmere Blend Sweater",
    brand: "Zara Man",
    price: 159,
    originalPrice: 199,
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop"],
    category: "Sweaters",
    colors: ["Charcoal", "Camel", "Navy"],
    sizes: [{ size: "S", price: 159 }, { size: "M", price: 159 }, { size: "L", price: 169 }, { size: "XL", price: 169 }],
    description: "Luxurious cashmere blend sweater with a relaxed fit. Perfect for layering.",
    buyLinks: [
      { store: "Zara", url: "https://zara.com", price: 159 },
      { store: "Amazon", url: "https://amazon.com", price: 169 },
    ],
  },
  {
    id: "5",
    name: "Minimalist Leather Watch",
    brand: "Daniel Wellington",
    price: 189,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=800&fit=crop"],
    category: "Accessories",
    colors: ["Black", "Brown"],
    sizes: [{ size: "40mm", price: 189 }, { size: "44mm", price: 199 }],
    description: "Sleek minimalist watch with genuine leather strap and Swiss movement.",
    buyLinks: [
      { store: "Amazon", url: "https://amazon.com", price: 189 },
      { store: "DW Official", url: "https://danielwellington.com", price: 199 },
    ],
    trending: true,
    newArrival: true,
  },
  {
    id: "6",
    name: "Chelsea Boots",
    brand: "Dr. Martens",
    price: 219,
    images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop"],
    category: "Footwear",
    colors: ["Black", "Cherry Red"],
    sizes: [{ size: "7", price: 219 }, { size: "8", price: 219 }, { size: "9", price: 229 }, { size: "10", price: 229 }, { size: "11", price: 239 }, { size: "12", price: 239 }],
    description: "Iconic Chelsea boots with signature air-cushioned sole. Durable and stylish.",
    buyLinks: [
      { store: "Dr. Martens", url: "https://drmartens.com", price: 219 },
      { store: "Amazon", url: "https://amazon.com", price: 209 },
      { store: "Myntra", url: "https://myntra.com", price: 225 },
    ],
  },
  {
    id: "7",
    name: "Graphic Print T-Shirt",
    brand: "Kenzo",
    price: 79,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop"],
    category: "T-Shirts",
    colors: ["Black", "White", "Grey"],
    sizes: [{ size: "S", price: 79 }, { size: "M", price: 79 }, { size: "L", price: 85 }, { size: "XL", price: 85 }],
    description: "Premium cotton t-shirt with exclusive graphic print. Relaxed fit.",
    buyLinks: [
      { store: "Kenzo", url: "https://kenzo.com", price: 79 },
      { store: "Myntra", url: "https://myntra.com", price: 75 },
    ],
    newArrival: true,
  },
  {
    id: "8",
    name: "Wool Blend Overcoat",
    brand: "Ted Baker",
    price: 449,
    originalPrice: 599,
    images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop"],
    category: "Jackets",
    colors: ["Charcoal", "Camel", "Navy"],
    sizes: [{ size: "S", price: 449 }, { size: "M", price: 449 }, { size: "L", price: 469 }, { size: "XL", price: 469 }],
    description: "Sophisticated wool blend overcoat with peak lapels. Perfect for formal occasions.",
    buyLinks: [
      { store: "Ted Baker", url: "https://tedbaker.com", price: 449 },
      { store: "Amazon", url: "https://amazon.com", price: 459 },
    ],
    trending: true,
  },
  {
    id: "9",
    name: "Leather Belt",
    brand: "Gucci",
    price: 349,
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=800&fit=crop"],
    category: "Accessories",
    colors: ["Black", "Brown"],
    sizes: [{ size: "32", price: 349 }, { size: "34", price: 349 }, { size: "36", price: 349 }, { size: "38", price: 359 }, { size: "40", price: 359 }],
    description: "Signature leather belt with iconic buckle. Made in Italy.",
    buyLinks: [
      { store: "Gucci", url: "https://gucci.com", price: 349 },
      { store: "Farfetch", url: "https://farfetch.com", price: 359 },
    ],
  },
  {
    id: "10",
    name: "Performance Sneakers",
    brand: "Nike",
    price: 149,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop"],
    category: "Footwear",
    colors: ["White", "Black", "Red"],
    sizes: [{ size: "7", price: 149 }, { size: "8", price: 149 }, { size: "9", price: 159 }, { size: "10", price: 159 }, { size: "11", price: 169 }, { size: "12", price: 169 }],
    description: "High-performance sneakers with responsive cushioning. Ideal for sports and casual wear.",
    buyLinks: [
      { store: "Nike", url: "https://nike.com", price: 149 },
      { store: "Amazon", url: "https://amazon.com", price: 139 },
      { store: "Myntra", url: "https://myntra.com", price: 145 },
    ],
    trending: true,
    newArrival: true,
  },
  {
    id: "11",
    name: "Denim Jacket",
    brand: "Levi's",
    price: 119,
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop"],
    category: "Jackets",
    colors: ["Light Wash", "Dark Wash", "Black"],
    sizes: [{ size: "S", price: 119 }, { size: "M", price: 119 }, { size: "L", price: 129 }, { size: "XL", price: 129 }],
    description: "Classic trucker denim jacket. Iconic style that never goes out of fashion.",
    buyLinks: [
      { store: "Levi's", url: "https://levis.com", price: 119 },
      { store: "Amazon", url: "https://amazon.com", price: 109 },
    ],
  },
  {
    id: "12",
    name: "Tailored Blazer",
    brand: "Armani Exchange",
    price: 279,
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop"],
    category: "Blazers",
    colors: ["Navy", "Charcoal", "Black"],
    sizes: [{ size: "38", price: 279 }, { size: "40", price: 279 }, { size: "42", price: 289 }, { size: "44", price: 289 }, { size: "46", price: 299 }],
    description: "Impeccably tailored blazer with modern slim fit. Perfect for business or evening wear.",
    buyLinks: [
      { store: "Armani", url: "https://armani.com", price: 279 },
      { store: "Myntra", url: "https://myntra.com", price: 269 },
    ],
    newArrival: true,
  },
  {
    id: "13",
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 179,
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop"],
    category: "Accessories",
    colors: ["Red/Green", "Silver/Blue", "Black/Grey"],
    sizes: [{ size: "58mm", price: 179 }, { size: "62mm", price: 189 }],
    description: "Timeless aviator sunglasses with polarized lenses. 100% UV protection.",
    buyLinks: [
      { store: "Ray-Ban", url: "https://ray-ban.com", price: 179 },
      { store: "Amazon", url: "https://amazon.com", price: 169 },
    ],
    trending: true,
  },
  {
    id: "14",
    name: "Jogger Pants",
    brand: "Adidas",
    price: 69,
    images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop"],
    category: "Pants",
    colors: ["Black", "Grey", "Navy"],
    sizes: [{ size: "S", price: 69 }, { size: "M", price: 69 }, { size: "L", price: 69 }, { size: "XL", price: 75 }, { size: "XXL", price: 75 }],
    description: "Comfortable jogger pants with tapered fit. Perfect for athleisure styling.",
    buyLinks: [
      { store: "Adidas", url: "https://adidas.com", price: 69 },
      { store: "Myntra", url: "https://myntra.com", price: 65 },
    ],
  },
  {
    id: "15",
    name: "Polo Shirt",
    brand: "Lacoste",
    price: 99,
    images: ["https://images.unsplash.com/photo-1625910513413-5fc45a2fa24b?w=600&h=800&fit=crop"],
    category: "Shirts",
    colors: ["White", "Navy", "Green", "Red"],
    sizes: [{ size: "S", price: 99 }, { size: "M", price: 99 }, { size: "L", price: 99 }, { size: "XL", price: 109 }],
    description: "Iconic polo shirt with signature crocodile logo. Premium petit piqué cotton.",
    buyLinks: [
      { store: "Lacoste", url: "https://lacoste.com", price: 99 },
      { store: "Amazon", url: "https://amazon.com", price: 89 },
    ],
    trending: true,
  },
  {
    id: "16",
    name: "Messenger Bag",
    brand: "Fossil",
    price: 199,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop"],
    category: "Accessories",
    colors: ["Brown", "Black", "Tan"],
    sizes: [{ size: "One Size", price: 199 }],
    description: "Handcrafted leather messenger bag with vintage appeal. Multiple compartments.",
    buyLinks: [
      { store: "Fossil", url: "https://fossil.com", price: 199 },
      { store: "Amazon", url: "https://amazon.com", price: 189 },
    ],
    newArrival: true,
  },
];

export const categories = [
  "All",
  "Jackets",
  "Shirts",
  "T-Shirts",
  "Pants",
  "Sweaters",
  "Blazers",
  "Footwear",
  "Accessories",
];

export const brands = [
  "All Brands",
  "AllSaints",
  "Hugo Boss",
  "Ralph Lauren",
  "Zara Man",
  "Daniel Wellington",
  "Dr. Martens",
  "Kenzo",
  "Ted Baker",
  "Gucci",
  "Nike",
  "Levi's",
  "Armani Exchange",
  "Ray-Ban",
  "Adidas",
  "Lacoste",
  "Fossil",
];

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "₹0 - ₹50", min: 0, max: 50 },
  { label: "₹50 - ₹300", min: 50, max: 300 },
  { label: "₹300 - ₹600", min: 300, max: 600 },
  { label: "₹600 - ₹1000", min: 600, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹4000", min: 2000, max: 4000 },
  { label: "Above ₹4000", min: 4000, max: Infinity },
];

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "New Arrivals", value: "new" },
  { label: "Popular", value: "popular" },
];
