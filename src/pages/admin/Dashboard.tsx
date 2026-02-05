
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    images: string[];
    image?: string;
}

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Convert snake_case to camelCase for frontend
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
            })) || [];

            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the list
        } catch (error: any) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };


    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="font-display text-4xl text-foreground">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/products/new"
                            className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading products...</div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <Link to={`/product/${product.id}`} className="block">
                                        <img
                                            src={product.images && product.images.length > 0 ? product.images[0] : (product.image || "")}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded-md bg-secondary hover:opacity-80 transition-opacity"
                                        />
                                    </Link>
                                    <div>
                                        <h3 className="font-medium text-foreground">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {product.brand} • ₹{product.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/admin/products/${product.id}`}
                                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No products found. Add one or migrate mock data.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
