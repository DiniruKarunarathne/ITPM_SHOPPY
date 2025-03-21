import React, { useState } from 'react';
import { useCart } from "../context/cartContext";

const ProductsPage = () => {
    // Sample products data - in a real app, this would likely come from an API
    const products = [
        {
            id: "1",
            name: "Premium T-Shirt",
            price: 29.99,
            image: "/images/tshirt.jpg",
            variants: ["Small", "Medium", "Large", "X-Large"],
        },
        {
            id: "2",
            name: "Designer Jeans",
            price: 79.99,
            image: "/images/jeans.jpg",
            variants: ["28x30", "30x32", "32x32", "34x34"],
        },
        {
            id: "3",
            name: "Casual Sneakers",
            price: 59.99,
            image: "/images/sneakers.jpg",
            variants: ["7", "8", "9", "10", "11"],
        },
        {
            id: "4",
            name: "Leather Wallet",
            price: 49.99,
            image: "/images/wallet.jpg",
        },
        {
            id: "5",
            name: "Sunglasses",
            price: 24.99,
            image: "/images/sunglasses.jpg",
        },
        {
            id: "6",
            name: "Watch",
            price: 129.99,
            image: "/images/watch.jpg",
            variants: ["Silver", "Gold", "Black"],
        },
    ];

    return (
        <div className="products-container">
            <h1>Our Products</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
//handel add to cart
const ProductItem = ({ product }) => {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(product.variants && product.variants.length > 0 ? product.variants[0] : null);

    const handleAddToCart = () => {
        const productToAdd = {
            ...product,
            variants: selectedVariant,
        };

        addItem(productToAdd, quantity);

        // Optional: Reset quantity after adding
        setQuantity(1);

        // Optional: Show confirmation message
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="product-item">
            {product.image ? <img src={product.image} alt={product.name} className="product-image" /> : <div className="product-image-placeholder"></div>}

            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>

            {product.variants && product.variants.length > 0 && (
                <div className="product-variants">
                    <label htmlFor={`variant-${product.id}`}>Variant:</label>
                    <select id={`variant-${product.id}`} value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}>
                        {product.variants.map((variant) => (
                            <option key={variant} value={variant}>
                                {variant}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="product-quantity">
                <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
                <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="quantity-btn" aria-label="Decrease quantity">
                        -
                    </button>
                    <input id={`quantity-${product.id}`} type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="quantity-input" />
                    <button onClick={() => setQuantity(quantity + 1)} className="quantity-btn" aria-label="Increase quantity">
                        +
                    </button>
                </div>
            </div>

            <button onClick={handleAddToCart} className="add-to-cart-btn">
                Add to Cart
            </button>
        </div>
    );
};

export default ProductsPage;
