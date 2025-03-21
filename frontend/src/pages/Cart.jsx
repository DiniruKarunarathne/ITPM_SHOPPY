import React from "react";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
    const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

    // Format price as currency
    const formatPrice = (price) => {
        return price?.toFixed(2);
    };

    // If cart is empty
    if (items?.length === 0) {
        return (
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <Link to="/shop" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            <div className="cart-header">
                <div className="cart-count">
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </div>
                <button onClick={clearCart} className="clear-cart-btn">
                    Clear Cart
                </button>
            </div>

            <div className="cart-items">
                {items?.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div className="item-image">{item.image ? <img src={item.image} alt={item.name} /> : <div className="image-placeholder"></div>}</div>

                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p className="item-price">{formatPrice(item.price)}</p>
                            {item.variants && <p className="item-variant">{item.variants}</p>}
                        </div>

                        <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="quantity-btn" aria-label="Decrease quantity">
                                -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn" aria-label="Increase quantity">
                                +
                            </button>
                        </div>

                        <div className="item-subtotal">{formatPrice(item.price * item.quantity)}</div>

                        <button onClick={() => removeItem(item.id)} className="remove-item-btn" aria-label="Remove item">
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Calculated at checkout</span>
                </div>
                <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>

                <div className="cart-actions">
                    <Link to="/shop" className="continue-shopping">
                        Continue Shopping
                    </Link>
                    <Link to="/checkout" className="checkout-btn">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
