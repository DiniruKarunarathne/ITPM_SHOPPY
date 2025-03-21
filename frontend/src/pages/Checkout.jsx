import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { Link, useNavigate } from "react-router-dom";

// Checkout form steps
const STEPS = {
    SHIPPING: "shipping",
    PAYMENT: "payment",
    REVIEW: "review",
    CONFIRMATION: "confirmation",
};

const CheckoutPage = () => {
    const { items, totalItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(STEPS.SHIPPING);

    // Form states
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
        phone: "",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        sameAsShipping: true,
    });

    const [billingAddress, setBillingAddress] = useState({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
    });

    const [shippingMethod, setShippingMethod] = useState("standard");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Format price as currency
    const formatPrice = (price) => {
        return price?.toFixed(2);
    };

    // Calculate shipping cost
    const getShippingCost = () => {
        switch (shippingMethod) {
            case "express":
                return 15.99;
            case "priority":
                return 9.99;
            case "standard":
            default:
                return 4.99;
        }
    };

    // Calculate tax (simplified example - 8.5%)
    const getTax = () => {
        return totalPrice * 0.085;
    };

    // Calculate order total
    const getOrderTotal = () => {
        return totalPrice + getShippingCost() + getTax();
    };

    // Handle shipping form changes
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle payment form changes
    const handlePaymentChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setPaymentInfo((prev) => ({ ...prev, [name]: checked }));
        } else {
            setPaymentInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle billing address changes
    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress((prev) => ({ ...prev, [name]: value }));
    };

    // Handle shipping method changes
    const handleShippingMethodChange = (e) => {
        setShippingMethod(e.target.value);
    };

    // Submit handler for shipping step
    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(STEPS.PAYMENT);
        window.scrollTo(0, 0);
    };

    // Submit handler for payment step
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(STEPS.REVIEW);
        window.scrollTo(0, 0);
    };

    // Submit handler for review step (place order)
    const handlePlaceOrder = (e) => {
        e.preventDefault();

        // This would typically send data to your backend API
        // Simulating API call with timeout
        setTimeout(() => {
            // Generate random order ID
            const generatedOrderId =
                "ORD-" +
                Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0");
            setOrderId(generatedOrderId);
            setOrderPlaced(true);
            setCurrentStep(STEPS.CONFIRMATION);
            clearCart(); // Clear cart after successful order
            window.scrollTo(0, 0);
        }, 1500);
    };

    // If cart is empty and not on confirmation page, redirect to cart
    if (items.length === 0 && currentStep !== STEPS.CONFIRMATION) {
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

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {/* Checkout Progress */}
            {currentStep !== STEPS.CONFIRMATION && (
                <div className="checkout-progress">
                    <div className={`progress-step ${currentStep === STEPS.SHIPPING ? "active" : ""} ${currentStep === STEPS.PAYMENT || currentStep === STEPS.REVIEW ? "completed" : ""}`}>
                        <div className="step-number">1</div>
                        <div className="step-title">Shipping</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${currentStep === STEPS.PAYMENT ? "active" : ""} ${currentStep === STEPS.REVIEW ? "completed" : ""}`}>
                        <div className="step-number">2</div>
                        <div className="step-title">Payment</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${currentStep === STEPS.REVIEW ? "active" : ""}`}>
                        <div className="step-number">3</div>
                        <div className="step-title">Review</div>
                    </div>
                </div>
            )}

            {/* Shipping Step */}
            {currentStep === STEPS.SHIPPING && (
                <div className="checkout-step shipping-step">
                    <div className="checkout-main">
                        <h2>Shipping Information</h2>
                        <form onSubmit={handleShippingSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" value={shippingInfo.firstName} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" value={shippingInfo.lastName} onChange={handleShippingChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={shippingInfo.email} onChange={handleShippingChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleShippingChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input type="text" id="state" name="state" value={shippingInfo.state} onChange={handleShippingChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="zipCode">Zip Code</label>
                                    <input type="text" id="zipCode" name="zipCode" value={shippingInfo.zipCode} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select id="country" name="country" value={shippingInfo.country} onChange={handleShippingChange} required>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} placeholder="(123) 456-7890" required />
                            </div>

                            <h2>Shipping Method</h2>
                            <div className="shipping-methods">
                                <div className="shipping-method">
                                    <input type="radio" id="standard" name="shippingMethod" value="standard" checked={shippingMethod === "standard"} onChange={handleShippingMethodChange} />
                                    <label htmlFor="standard">
                                        <div className="method-name">Standard Shipping</div>
                                        <div className="method-price">{formatPrice(4.99)}</div>
                                        <div className="method-time">5-7 business days</div>
                                    </label>
                                </div>
                                <div className="shipping-method">
                                    <input type="radio" id="priority" name="shippingMethod" value="priority" checked={shippingMethod === "priority"} onChange={handleShippingMethodChange} />
                                    <label htmlFor="priority">
                                        <div className="method-name">Priority Shipping</div>
                                        <div className="method-price">{formatPrice(9.99)}</div>
                                        <div className="method-time">2-3 business days</div>
                                    </label>
                                </div>
                                <div className="shipping-method">
                                    <input type="radio" id="express" name="shippingMethod" value="express" checked={shippingMethod === "express"} onChange={handleShippingMethodChange} />
                                    <label htmlFor="express">
                                        <div className="method-name">Express Shipping</div>
                                        <div className="method-price">{formatPrice(15.99)}</div>
                                        <div className="method-time">1-2 business days</div>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <Link to="/cart" className="back-button">
                                    Back to Cart
                                </Link>
                                <button type="submit" className="next-button">
                                    Continue to Payment
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="checkout-sidebar">
                        <OrderSummary items={items} totalPrice={totalPrice} shippingCost={getShippingCost()} tax={getTax()} orderTotal={getOrderTotal()} />
                    </div>
                </div>
            )}

            {/* Payment Step */}
            {currentStep === STEPS.PAYMENT && (
                <div className="checkout-step payment-step">
                    <div className="checkout-main">
                        <h2>Payment Information</h2>
                        <form onSubmit={handlePaymentSubmit}>
                            <div className="form-group">
                                <label htmlFor="cardName">Name on Card</label>
                                <input type="text" id="cardName" name="cardName" value={paymentInfo.cardName} onChange={handlePaymentChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} placeholder="XXXX XXXX XXXX XXXX" required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input type="text" id="expiryDate" name="expiryDate" value={paymentInfo.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input type="text" id="cvv" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} placeholder="123" required />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <input type="checkbox" id="sameAsShipping" name="sameAsShipping" checked={paymentInfo.sameAsShipping} onChange={handlePaymentChange} />
                                <label htmlFor="sameAsShipping">Billing address is the same as shipping address</label>
                            </div>

                            {!paymentInfo.sameAsShipping && (
                                <div className="billing-address">
                                    <h3>Billing Address</h3>

                                    <div className="form-group">
                                        <label htmlFor="billingAddress">Street Address</label>
                                        <input type="text" id="billingAddress" name="address" value={billingAddress.address} onChange={handleBillingChange} required />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="billingCity">City</label>
                                            <input type="text" id="billingCity" name="city" value={billingAddress.city} onChange={handleBillingChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="billingState">State</label>
                                            <input type="text" id="billingState" name="state" value={billingAddress.state} onChange={handleBillingChange} required />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="billingZipCode">Zip Code</label>
                                            <input type="text" id="billingZipCode" name="zipCode" value={billingAddress.zipCode} onChange={handleBillingChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="billingCountry">Country</label>
                                            <select id="billingCountry" name="country" value={billingAddress.country} onChange={handleBillingChange} required>
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="AU">Australia</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={() => {
                                        setCurrentStep(STEPS.SHIPPING);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Back to Shipping
                                </button>
                                <button type="submit" className="next-button">
                                    Review Order
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="checkout-sidebar">
                        <OrderSummary items={items} totalPrice={totalPrice} shippingCost={getShippingCost()} tax={getTax()} orderTotal={getOrderTotal()} />
                    </div>
                </div>
            )}

            {/* Review Step */}
            {currentStep === STEPS.REVIEW && (
                <div className="checkout-step review-step">
                    <div className="checkout-main">
                        <h2>Review Your Order</h2>

                        <div className="review-section">
                            <div className="review-section-header">
                                <h3>Shipping Information</h3>
                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() => {
                                        setCurrentStep(STEPS.SHIPPING);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="review-info">
                                <p>
                                    {shippingInfo.firstName} {shippingInfo.lastName}
                                </p>
                                <p>{shippingInfo.email}</p>
                                <p>{shippingInfo.address}</p>
                                <p>
                                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                                </p>
                                <p>{shippingInfo.country}</p>
                                <p>{shippingInfo.phone}</p>
                            </div>
                            <div className="review-info">
                                <h4>Shipping Method</h4>
                                <p>
                                    {shippingMethod === "standard" && "Standard Shipping (5-7 business days)"}
                                    {shippingMethod === "priority" && "Priority Shipping (2-3 business days)"}
                                    {shippingMethod === "express" && "Express Shipping (1-2 business days)"}
                                </p>
                            </div>
                        </div>

                        <div className="review-section">
                            <div className="review-section-header">
                                <h3>Payment Information</h3>
                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() => {
                                        setCurrentStep(STEPS.PAYMENT);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="review-info">
                                <p>{paymentInfo.cardName}</p>
                                <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                                <p>Expires {paymentInfo.expiryDate}</p>
                            </div>

                            {!paymentInfo.sameAsShipping && (
                                <div className="review-info">
                                    <h4>Billing Address</h4>
                                    <p>{billingAddress.address}</p>
                                    <p>
                                        {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
                                    </p>
                                    <p>{billingAddress.country}</p>
                                </div>
                            )}
                        </div>

                        <div className="review-items">
                            <h3>Order Items ({totalItems})</h3>
                            {items.map((item) => (
                                <div key={item.id} className="review-item">
                                    <div className="item-info">
                                        <div className="item-image">{item.image ? <img src={item.image} alt={item.name} /> : <div className="image-placeholder"></div>}</div>
                                        <div>
                                            <h4>{item.name}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                            {item.variants && <p className="item-variant">{item.variants}</p>}
                                        </div>
                                    </div>
                                    <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => {
                                    setCurrentStep(STEPS.PAYMENT);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                Back to Payment
                            </button>
                            <button type="button" className="place-order-button" onClick={handlePlaceOrder}>
                                Place Order
                            </button>
                        </div>
                    </div>

                    <div className="checkout-sidebar">
                        <OrderSummary items={items} totalPrice={totalPrice} shippingCost={getShippingCost()} tax={getTax()} orderTotal={getOrderTotal()} />
                    </div>
                </div>
            )}

            {/* Confirmation Step */}
            {currentStep === STEPS.CONFIRMATION && (
                <div className="checkout-step confirmation-step">
                    <div className="order-confirmation">
                        <div className="confirmation-icon">✓</div>
                        <h2>Thank You for Your Order!</h2>
                        <p className="order-number">
                            Order Number: <span>{orderId}</span>
                        </p>
                        <p>
                            We've received your order and will begin processing it right away. You will receive a confirmation email shortly at <strong>{shippingInfo.email}</strong>.
                        </p>

                        <div className="order-details">
                            <h3>Order Details</h3>
                            <div className="detail-row">
                                <span>Order Date:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Order Total:</span>
                                <span>{formatPrice(getOrderTotal())}</span>
                            </div>
                            <div className="detail-row">
                                <span>Shipping Method:</span>
                                <span>
                                    {shippingMethod === "standard" && "Standard Shipping (5-7 business days)"}
                                    {shippingMethod === "priority" && "Priority Shipping (2-3 business days)"}
                                    {shippingMethod === "express" && "Express Shipping (1-2 business days)"}
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
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
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
                        <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
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
                    <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="calc-row">
                    <span>Shipping</span>
                    <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="calc-row">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(tax)}</span>
                </div>
                <div className="calc-row total">
                    <span>Total</span>
                    <span>{formatPrice(orderTotal)}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
