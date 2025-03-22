import React, { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../utils/api";

const CheckoutPage = () => {
    const { items, totalItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const isAuthenticated = apiService.auth.isAuthenticated();
            setIsLoggedIn(isAuthenticated);
            
            // If not authenticated, redirect to login
            if (!isAuthenticated) {
                navigate('/login', { 
                    state: { 
                        from: '/checkout',
                        message: 'Please login to complete your purchase' 
                    } 
                });
            }
        };
        
        checkAuth();
    }, [navigate]);

    // Combined form state
    const [formData, setFormData] = useState({
        // Shipping address
        address: "",
        city: "",
        postalCode: "",
        country: "USA",
        // Payment method
        paymentMethod: "cash_on_delivery" // Changed to match backend enum values
    });

    // Format price as currency
    const formatPrice = (price) => {
        return price?.toFixed(2);
    };

    // Calculate order total with shipping
    const shippingCost = 5.00; // Fixed shipping cost
    
    const getOrderTotal = () => {
        return totalPrice + shippingCost;
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit handler for form (place order)
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            setError(null);
            
            // Format the order data according to the API requirements
            const orderData = {
                products: items.map(item => ({
                    product: item.id, // Using the product ID from the cart
                    quantity: item.quantity
                })),
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                paymentMethod: formData.paymentMethod
            };
            
            // Call the API to create the order
            const response = await apiService.orders.create(orderData);
            
            // Handle successful order creation
            setOrderId(response.data._id);
            setOrderPlaced(true);
            clearCart(); // Clear cart after successful order
            window.scrollTo(0, 0);
            
        } catch (err) {
            console.error("Error placing order:", err);
            setError(
                err.response?.data?.message || 
                "There was a problem placing your order. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // If cart is empty and not on confirmation page, redirect to cart
    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="cart-container">
                <h1>Checkout</h1>
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <Link to="/shop" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // If not logged in, show loading while redirecting
    if (!isLoggedIn && !orderPlaced) {
        return (
            <div className="checkout-container">
                <h1>Checkout</h1>
                <p>Please wait, redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {!orderPlaced ? (
                <div className="checkout-step">
                    <div className="checkout-main">
                        <h2>Shipping & Payment Information</h2>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handlePlaceOrder}>
                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input 
                                        type="text" 
                                        id="city" 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input 
                                        type="text" 
                                        id="postalCode" 
                                        name="postalCode" 
                                        value={formData.postalCode} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input 
                                    type="text" 
                                    id="country" 
                                    name="country" 
                                    value={formData.country} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="paymentMethod">Payment Method</label>
                                <select 
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="cash_on_delivery">Cash on Delivery</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>

                            <div className="review-items">
                                <h3>Order Items ({totalItems})</h3>
                                {items.map((item) => (
                                    <div key={item.id} className="review-item">
                                        <div className="item-info">
                                            <div className="item-image">
                                                {item.image ? <img src={item.image} alt={item.name} /> : <div className="image-placeholder"></div>}
                                            </div>
                                            <div>
                                                <h4>{item.name}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                                {item.variants && <p className="item-variant">{item.variants}</p>}
                                            </div>
                                        </div>
                                        <div className="item-price">${formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-actions">
                                <Link to="/cart" className="back-button">
                                    Back to Cart
                                </Link>
                                <button 
                                    type="submit" 
                                    className="place-order-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="checkout-sidebar">
                        <OrderSummary 
                            items={items} 
                            totalPrice={totalPrice} 
                            shippingCost={shippingCost} 
                            tax={0} 
                            orderTotal={getOrderTotal()} 
                        />
                    </div>
                </div>
            ) : (
                <div className="checkout-step confirmation-step">
                    <div className="order-confirmation">
                        <div className="confirmation-icon">✓</div>
                        <h2>Thank You for Your Order!</h2>
                        <p className="order-number">
                            Order Number: <span>{orderId}</span>
                        </p>
                        <p>
                            We've received your order and will begin processing it right away. You will receive a confirmation email shortly.
                        </p>

                        <div className="order-details">
                            <h3>Order Details</h3>
                            <div className="detail-row">
                                <span>Order Date:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Order Total:</span>
                                <span>${formatPrice(getOrderTotal())}</span>
                            </div>
                            <div className="detail-row">
                                <span>Payment Method:</span>
                                <span>
                                    {formData.paymentMethod === "credit_card" && "Credit Card"}
                                    {formData.paymentMethod === "cash_on_delivery" && "Cash on Delivery"}
                                    {formData.paymentMethod === "paypal" && "PayPal"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span>Shipping Address:</span>
                                <span>
                                    {formData.address}, {formData.city}, {formData.postalCode}, {formData.country}
                                </span>
                            </div>
                        </div>

                        <div className="order-actions">
                            <Link to="/" className="home-button">
                                Return to Home
                            </Link>
                            <Link to="/shop" className="shop-more-button">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Order Summary Component
const OrderSummary = ({ items, totalPrice, shippingCost, tax, orderTotal }) => {
    const formatPrice = (price) => {
        return price.toFixed(2);
    };

    return (
        <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-items">
                {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="summary-item">
                        <div className="item-name">
                            {item.name} <span className="item-quantity">×{item.quantity}</span>
                        </div>
                        <div className="item-price">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                ))}

                {items.length > 3 && (
                    <div className="more-items">
                        + {items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
                    </div>
                )}
            </div>

            <div className="summary-calculations">
                <div className="calc-row">
                    <span>Subtotal</span>
                    <span>${formatPrice(totalPrice)}</span>
                </div>
                <div className="calc-row">
                    <span>Shipping</span>
                    <span>${formatPrice(shippingCost)}</span>
                </div>
                {tax > 0 && (
                    <div className="calc-row">
                        <span>Estimated Tax</span>
                        <span>${formatPrice(tax)}</span>
                    </div>
                )}
                <div className="calc-row total">
                    <span>Total</span>
                    <span>${formatPrice(orderTotal)}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;