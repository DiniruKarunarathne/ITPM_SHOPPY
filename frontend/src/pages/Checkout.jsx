import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "../pages/cart/cartproduct";
import emptyCartImage from "../assets/empty.gif";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { fetchAllCartItems } from "../services/redux/productSlice";
import DefaultButton from "../components/home/DefaultButton";
import { toast } from "react-toastify";
import axios from "axios";

export default function Checkout() {
  const [showCardFields, setShowCardFields] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const handlePaymentMethodChange = (e) => {
    setShowCardFields(e.target.value === 'CARD');
  };
  
  const dispatch = useDispatch();
  const productCartItem = useSelector((state) => state.product.cartItem);

  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );
  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const paymentMethod = formData.get("payment-method");

    const data = {
      fullName: formData.get("full-name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      paymentMethod: paymentMethod,
      holder: formData.get("card-holder"),
      expire: formData.get("credit-expiry"),
      cvc: formData.get("credit-cvc"),
      addres: formData.get("billing-address"),
      state: formData.get("billing-state"),
      zip: formData.get("billing-zip"),
      deliveryNotes: formData.get("delivery-notes"),
      totalQty: totalQty,
      totalPrice: totalPrice,
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/api/createpayment",
        data
      );

      toast.success("Order placed successfully!");

      console.log("Server response:", response.data);

      // Set order details for the success screen
      setOrderDetails({
        orderId: response.data.orderId || "ORD" + Math.floor(Math.random() * 1000000),
        customerName: data.fullName,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod === "COD" ? "Cash On Delivery" : "Card Payment",
        items: productCartItem
      });

      // Set order placed to true to show success screen
      setOrderPlaced(true);

      // Delete all cart items after successful payment
      await axios.delete("http://localhost:8082/allcart");
      
      // Don't reload the page - we want to show the success screen
      // window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error processing payment. Please try again.");
    }
  };

  // Order Success Screen
  const OrderSuccessScreen = () => {
    if (!orderDetails) return null;
    
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Successful!</h2>
        <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-8">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Order Summary</h3>
            {/* <p className="text-gray-500">Order #{orderDetails.orderId}</p> */}
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer Name</span>
              <span className="font-medium">{orderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">{totalQty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600 font-semibold">Total Amount</span>
              <span className="font-bold text-blue-600">Rs. {orderDetails.totalAmount}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
            Continue Shopping
          </Link>
          <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors duration-300">
            Go to Home
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8">
      {orderPlaced ? (
        <OrderSuccessScreen />
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-medium font-sans text-blue-900 uppercase mt-2 mb-2 mx-auto text-center md:text-left md:px-10">
            Checkout
          </h2>
          
          <div className="md:ml-4 lg:ml-12">
            {productCartItem.length > 0 ? (
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 xl:w-5/12">
                  <div className="mx-auto lg:ml-10" style={{ minHeight: "400px", maxHeight: "600px" }}>
                    {productCartItem.length > 0 && (
                      <Carousel
                        autoPlay={false}
                        animation="slide"
                        indicators={true}
                        timeout={500}
                        navButtonsAlwaysVisible={true}
                      >
                        {productCartItem.map((item, index) => (
                          <div key={index} className="w-full">
                            <CartProduct
                              id={item._id}
                              images={item.images}
                              categories={item.categories}
                              quantity={item.quantity}
                              price={item.price}
                              description={item.description}
                              title={item.title}
                              total={item.total}
                              qty={item.qty}
                            />
                          </div>
                        ))}
                      </Carousel>
                    )}
                  </div>
                  <div className="p-4 md:p-16 flex justify-center">
                    <p className="text-center md:text-left text-lg mt-2 my-4 font-semibold">
                      Still want to continue shopping?<br className="md:hidden" />
                      <Link
                        to={"/shop"}
                        className="text-blue-800 underline py-2 md:py-6 md:ml-12 inline-block"
                      >
                        Continue Shopping
                      </Link>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="w-full lg:w-1/2 xl:w-7/12 px-2 md:px-4 lg:px-8">
                  <div className="mt-6 bg-gray-50 px-4 pt-8 rounded-lg shadow-sm">
                    <p className="text-xl font-medium">Billing Details</p>
                    <p className="text-gray-400">
                      Complete your order by providing your payment details.
                    </p>
                    <div>
                      <label
                        htmlFor="full-name"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="full-name"
                          name="full-name"
                          required
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-4 md:pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <label
                        htmlFor="email"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          required
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-4 md:pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="your.email@gmail.com"
                        />
                      </div>
                      
                      <label
                        htmlFor="phone"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-4 md:pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <label
                        htmlFor="payment-method"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Payment Method
                      </label>
                      <div className="relative">
                        <select
                          id="payment-method"
                          name="payment-method"
                          required
                          onChange={handlePaymentMethodChange}
                          className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select payment method</option>
                          <option value="COD">Cash On Delivery (COD)</option>
                          <option value="CARD">Card Payment</option>
                        </select>
                      </div>
                      
                      <div id="card-payment-fields" className={`mt-4 ${showCardFields ? 'block' : 'hidden'}`}>
                        <label
                          htmlFor="card-holder"
                          className="mt-4 mb-2 block text-sm font-medium"
                        >
                          Card Holder Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="card-holder"
                            name="card-holder"
                            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-4 md:pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Name on card"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                          <div className="flex gap-2 w-full">
                            <div className="w-1/2">
                              <label htmlFor="credit-expiry" className="mb-2 block text-sm font-medium">Expiry Date</label>
                              <input
                                type="text"
                                id="credit-expiry"
                                name="credit-expiry"
                                className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="w-1/2">
                              <label htmlFor="credit-cvc" className="mb-2 block text-sm font-medium">CVC</label>
                              <input
                                type="text"
                                id="credit-cvc"
                                name="credit-cvc"
                                className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="CVC"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <label
                        htmlFor="billing-address"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Delivery Address
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <div className="relative flex-shrink-0 w-full sm:w-7/12">
                          <input
                            type="text"
                            id="billing-address"
                            name="billing-address"
                            required
                            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-4 md:pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Street Address"
                          />
                        </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-2">
                        <div className="flex gap-2 w-full">
                          <select
                            name="billing-state"
                            required
                            className="w-1/2 sm:w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="">Select Province</option>
                            <option value="Western">Western Province</option>
                            <option value="Central">Central Province</option>
                            <option value="Southern">Southern Province</option>
                            <option value="Northern">Northern Province</option>
                            <option value="Eastern">Eastern Province</option>
                            <option value="NorthWestern">North Western Province</option>
                            <option value="NorthCentral">North Central Province</option>
                            <option value="Uva">Uva Province</option>
                            <option value="Sabaragamuwa">Sabaragamuwa Province</option>
                          </select>
                          <input
                            type="text"
                            name="billing-zip"
                            required
                            className="w-1/2 sm:flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="ZIP"
                          />
                        </div>
                      </div>
                      
                      <label
                        htmlFor="delivery-notes"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Delivery Notes (Optional)
                      </label>
                      <div className="relative">
                        <textarea
                          id="delivery-notes"
                          name="delivery-notes"
                          rows="3"
                          className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Special instructions for delivery"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="bg-blue-300 rounded-lg text-xl md:text-2xl font-medium font-sans text-primary mt-2 mb-6 px-4 md:px-10 py-2 text-center">
                      Order Summary
                    </h2>
                    <div className="flex w-full py-2 font-sans text-black text-base md:text-lg text-justify font-bold">
                      <p className="w-2/4">Product Name</p>
                      <p className="w-1/4 text-center font-sans text-black font-bold">
                        Quantity
                      </p>
                      <p className="w-1/4 text-right font-sans text-black font-bold">
                        Total
                      </p>
                    </div>
                    
                    {/* Render product quantities, totals, and categories */}
                    <div className="max-h-48 overflow-y-auto">
                      {productCartItem.map((item, index) => (
                        <div key={index} className="flex w-full py-2 text-base md:text-lg">
                          <p className="w-2/4 truncate pr-2">{item.title}</p>
                          <p className="w-1/4 text-center font-sans text-black">
                            {item.qty}
                          </p>
                          <p className="w-1/4 text-right font-sans text-black">
                            {item.total}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-b mt-4"></div>
                    <div className="flex w-full py-2 text-lg border-b">
                      <p className="font-sans text-black text-lg font-bold">
                        Total Qty:
                      </p>
                      <p className="ml-auto font-sans text-black text-lg font-bold">
                        {totalQty}
                      </p>
                    </div>
                    <div className="flex w-full py-2 font-sans text-black text-lg font-bold border-b">
                      <p>Total Price:</p>
                      <p className="ml-auto">
                        <span className="text-red-500">Rs.</span> {totalPrice}
                      </p>
                    </div>
                    <div className="mt-8 flex justify-center">
                      <DefaultButton title="Purchase Now" />
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex w-full justify-center items-center flex-col">
                <img
                  src={emptyCartImage}
                  className="w-full max-w-sm"
                  style={{ marginTop: "50px" }}
                  alt="Empty Cart"
                />
                <p className="text-slate-500 text-2xl md:text-3xl font-bold">Empty Cart</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}