
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { categories } from "@/data/mockProducts";
import { X } from "lucide-react";

// Helper to upload to Firebase Storage
import { uploadImageToFirebase } from "@/lib/storage";
const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        category: "",
        colors: "",
        sizes: [] as { size: string; price: number }[],
        images: [] as string[],
        buyLinks: [] as { platform: string; url: string }[],
        description: "",
        showOnHomepage: false,
        isTopPick: false,
        isNewArrival: false,
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            const fetchProduct = async () => {
                try {
                    const { supabase } = await import('@/lib/supabase');
                    const { data: product, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) throw error;

                    if (product) {
                        setFormData({
                            name: product.name || "",
                            brand: product.brand || "",
                            price: product.price?.toString() || "",
                            category: product.category || "",
                            colors: product.colors ? (Array.isArray(product.colors) ? product.colors.join(", ") : product.colors) : "",
                            sizes: product.sizes || [],
                            images: product.images || [],
                            buyLinks: product.buy_links || [],
                            description: product.description || "",
                            showOnHomepage: product.show_on_homepage || false,
                            isTopPick: product.is_top_pick || false,
                            isNewArrival: product.is_new_arrival || false,
                        });
                    }
                } catch (error) {
                    console.error("Error loading product:", error);
                    toast.error("Failed to load product data");
                }
            };
            fetchProduct();
        }
    }, [isEdit, id]);

    const handleSizeChange = (index: number, field: "size" | "price", value: string) => {
        const newSizes = [...formData.sizes];
        if (field === "price") {
            newSizes[index] = { ...newSizes[index], price: Number(value) };
        } else {
            newSizes[index] = { ...newSizes[index], size: value };
        }
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { size: "", price: Number(formData.price || 0) }]
        });
    };

    const removeSize = (index: number) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleBuyLinkChange = (index: number, field: "platform" | "url", value: string) => {
        const newLinks = [...formData.buyLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, buyLinks: newLinks });
    };

    const addBuyLink = () => {
        setFormData({
            ...formData,
            buyLinks: [...formData.buyLinks, { platform: "", url: "" }]
        });
    };

    const removeBuyLink = (index: number) => {
        const newLinks = formData.buyLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, buyLinks: newLinks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.price || !formData.category) {
            toast.error("Please fill in all required fields (Name, Price, Category)");
            return;
        }

        setLoading(true);
        console.log("Starting product save...");

        try {
            // No file uploads - user must paste URLs directly
            const finalImages = [...formData.images];

            // Ensure colors is a string before splitting
            const colorString = typeof formData.colors === 'string' ? formData.colors : "";
            const colorArray = colorString.split(",").map((c: string) => c.trim()).filter((c: string) => c !== "");

            const productData = {
                name: formData.name,
                brand: formData.brand,
                price: Number(formData.price),
                category: formData.category,
                description: formData.description,
                colors: colorArray,
                images: formData.images,
                sizes: formData.sizes,
                buy_links: formData.buyLinks, // Convert to snake_case
                show_on_homepage: formData.showOnHomepage, // Convert to snake_case
                is_top_pick: formData.isTopPick, // Convert to snake_case
                is_new_arrival: formData.isNewArrival, // Convert to snake_case
            };

            // Save to Supabase
            const { supabase } = await import('@/lib/supabase');

            if (isEdit && id) {
                // Update existing product in Supabase
                const { error } = await supabase
                    .from('products')
                    .update({
                        ...productData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', id);

                if (error) throw error;
                toast.success("Product updated successfully");
            } else {
                // Create new product in Supabase
                const { error } = await supabase
                    .from('products')
                    .insert([{
                        ...productData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }]);

                if (error) throw error;
                toast.success("Product created successfully");
            }

            console.log("Product saved to Supabase");
            navigate("/admin");
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    // Cloudinary Upload Widget
    const openCloudinaryWidget = () => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        console.log('Cloudinary Config:', { cloudName, uploadPreset });

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary not configured. Please check your .env file.");
            return;
        }

        // @ts-ignore - Cloudinary widget is loaded via script tag
        if (!window.cloudinary) {
            toast.error("Cloudinary widget not loaded. Please refresh the page.");
            return;
        }

        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset,
                multiple: true,
                maxFiles: 10,
                sources: ['local', 'url', 'camera'],
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                maxFileSize: 10000000, // 10MB
                folder: 'k-klub-products',
            },
            (error: any, result: any) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    const errorMsg = error.message || error.statusText || 'Unknown error';

                    if (errorMsg.includes('unsigned') || errorMsg.includes('preset')) {
                        toast.error('Upload preset must be "Unsigned". Check Cloudinary settings.');
                    } else {
                        toast.error('Upload failed: ' + errorMsg);
                    }
                    return;
                }

                console.log('Cloudinary result:', result);

                if (result.event === 'success') {
                    const imageUrl = result.info.secure_url;
                    console.log('Image uploaded:', imageUrl);
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, imageUrl]
                    }));
                    toast.success('Image uploaded successfully!');
                }

                if (result.event === 'close') {
                    widget.close();
                }
            }
        );

        widget.open();
    };

    const removeExistingImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Direct Cloudinary Upload (no widget)
    const handleCloudinaryUpload = async (files: FileList) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            toast.error("Cloudinary not configured. Please check your .env file.");
            return;
        }

        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'k-klub-products');

            try {
                toast.info(`Uploading ${file.name}...`);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error?.message || 'Upload failed');
                }

                const data = await response.json();
                uploadedUrls.push(data.secure_url);
                toast.success(`${file.name} uploaded!`);
            } catch (error: any) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}: ${error.message}`);
            }
        }

        if (uploadedUrls.length > 0) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleCloudinaryUpload(e.target.files);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
                <h1 className="font-display text-3xl text-foreground mb-8">
                    {isEdit ? "Edit Product" : "Add New Product"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 bg-card border border-border rounded-xl p-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                />
                            </div>
                        </div>

                        {/* Colors Input */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Colors (comma separated)</label>
                            <input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                placeholder="e.g. Red, Blue, Black"
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                            />
                        </div>

                        {/* Size & Price Management */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Sizes & Prices</label>
                            <div className="space-y-3">
                                {formData.sizes.map((sizeItem, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            placeholder="Size (e.g. S, M, 42)"
                                            value={sizeItem.size}
                                            onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                                            className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={sizeItem.price}
                                            onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                                            className="w-32 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSize(index)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    + Add Size Variant
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                            >
                                <option value="">Select Category</option>
                                {categories.filter(c => c !== "All").map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Homepage Display Options */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Homepage Display</label>
                            <div className="space-y-3 bg-secondary/50 p-4 rounded-lg border border-border">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.showOnHomepage}
                                        onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <div>
                                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">Show on Homepage</span>
                                        <p className="text-xs text-muted-foreground">Display this product on the homepage</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.isTopPick}
                                        onChange={(e) => setFormData({ ...formData, isTopPick: e.target.checked })}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <div>
                                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">Top Pick</span>
                                        <p className="text-xs text-muted-foreground">Feature in "Top Picks" section</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNewArrival}
                                        onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <div>
                                        <span className="text-foreground font-medium group-hover:text-primary transition-colors">New Arrival</span>
                                        <p className="text-xs text-muted-foreground">Feature in "New Arrivals" section</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Images</label>

                            {/* Existing Images */}
                            {formData.images.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-muted-foreground mb-2">Current Images</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {formData.images.map((url, idx) => (
                                            <div key={idx} className="relative group cursor-pointer" onDoubleClick={() => setPreviewImage(url)}>
                                                <img src={url} alt={`Product ${idx}`} className="w-full h-20 object-cover rounded-lg border border-border" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent preview on delete
                                                        removeExistingImage(idx);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-destructive text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Or paste image URL here..."
                                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = e.currentTarget.value;
                                            if (val.trim()) {
                                                const newUrls = val.split(',').map(url => url.trim()).filter(url => url);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, ...newUrls]
                                                }));
                                                e.currentTarget.value = "";
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (input.value.trim()) {
                                            const newUrls = input.value.split(',').map(url => url.trim()).filter(url => url);
                                            setFormData(prev => ({
                                                ...prev,
                                                images: [...prev.images, ...newUrls]
                                            }));
                                            input.value = "";
                                        }
                                    }}
                                    className="px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-border transition-colors"
                                >
                                    Add URL
                                </button>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1 mb-2">
                                You can paste direct links from Google Photos, Imgur, or other sites.
                            </p>

                            <input
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-center">
                                Upload images to Cloudinary (supports multiple files)
                            </p>
                        </div>

                        {/* Buy Links Management */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Buy Links</label>
                            <div className="space-y-3">
                                {formData.buyLinks.map((link, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <input
                                            type="text"
                                            placeholder="Platform (e.g. Amazon, Myntra)"
                                            value={link.platform}
                                            onChange={(e) => handleBuyLinkChange(index, "platform", e.target.value)}
                                            className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => handleBuyLinkChange(index, "url", e.target.value)}
                                            className="flex-[2] px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeBuyLink(index)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addBuyLink}
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    + Add Buy Link
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground input-luxury resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="px-6 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg btn-red disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain is-overlay"
                            style={{ maxHeight: '85vh' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
