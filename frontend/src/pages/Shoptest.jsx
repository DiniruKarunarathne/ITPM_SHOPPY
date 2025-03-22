import React, { useState, useEffect } from 'react';
import { useCart } from "../context/cartContext";
import apiService from "../utils/api";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products using the API wrapper
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await apiService.products.getAll();
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="products-container">
            <h1>Our Products</h1>
            {products.length === 0 ? (
                <p>No products available at the moment.</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductItem = ({ product }) => {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    // For variants, we'll check if the product has variants from the API
    // In our MongoDB model, we didn't have variants, so we'll need to adapt this
    // Assuming we might extract categories or sizes from the product data
    
    // Get the first image URL from the product's images array
    const imageUrl = product.images && product.images.length > 0 
        ? apiService.products.getImageUrl(product.images[0])
        : null;

    const handleAddToCart = () => {
        const productToAdd = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: imageUrl,
            // No variants in our model, but we could add this later if needed
        };

        addItem(productToAdd, quantity);

        // Reset quantity after adding
        setQuantity(1);

        // Show confirmation message
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="product-item">
            {imageUrl ? 
                <img src={imageUrl} alt={product.name} className="product-image" /> : 
                <div className="product-image-placeholder"></div>
            }

            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            
            {/* We can add category or other product details here */}
            <p className="product-category">Category: {product.category}</p>
            
            {/* Stock information */}
            <p className="product-stock">
                {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : "Out of Stock"}
            </p>

            <div className="product-quantity">
                <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
                <div className="quantity-controls">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="quantity-btn" 
                        aria-label="Decrease quantity"
                        disabled={product.stock <= 0}
                    >
                        -
                    </button>
                    <input 
                        id={`quantity-${product._id}`} 
                        type="number" 
                        min="1" 
                        max={product.stock} 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} 
                        className="quantity-input"
                        disabled={product.stock <= 0}
                    />
                    <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
                        className="quantity-btn" 
                        aria-label="Increase quantity"
                        disabled={quantity >= product.stock || product.stock <= 0}
                    >
                        +
                    </button>
                </div>
            </div>

            <button 
                onClick={handleAddToCart} 
                className="add-to-cart-btn"
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
        </div>
    );
};

export default ProductsPage;