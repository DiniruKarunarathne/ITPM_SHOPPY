import React, { useEffect } from "react";
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

    const data = {
      email: formData.get("email"),
      holder: formData.get("card-holder"),
      card: formData.get("card-no"),
      expire: formData.get("credit-expiry"),
      cvc: formData.get("credit-cvc"),
      addres: formData.get("billing-address"),
      state: formData.get("billing-state"),
      zip: formData.get("billing-zip"),
      totalQty: totalQty,
      totalPrice: totalPrice,
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/api/createpayment",
        data
      );

      toast.success("Payment successful!");

      console.log("Server response:", response.data);

      // Delete all cart items after successful payment
      await axios.delete("http://localhost:8082/allcart");

      // Refresh the page after successful payment
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-medium font-sans text-blue-900 uppercase mt-2 mb-2 mx-auto px-10">
        Checkout
      </h2>
      <Link to={"/cart"}>
        <div className="flex cursor-pointer">
          <div className="ml-32">
            <box-icon name="undo" size="40px"></box-icon>
          </div>
          <div className="mt-2 text-gray-400">Back</div>
        </div>
      </Link>
      <div className="ml-12">
        {productCartItem.length > 0 ? (
          <div className="flex ">
            <div className="">
              <div className="ml-10 " style={{ width: 500, height: 600 }}>
                {productCartItem.length > 0 && (
                  <Carousel
                    autoPlay={false}
                    animation="slide"
                    indicators={true}
                    timeout={500}
                    navButtonsAlwaysVisible={true}
                  >
                    {productCartItem.map((item, index) => (
                      <div key={index} className="w-full max-w-3xl">
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
              <div className="p-16 flex justify-center">
                <p className="text-left text-2ml mt-2 my-4  font-semibold">
                  Still want to continue shopping ? <br></br>
                  <Link
                    to={"/shop"}
                    className="text-blue-800 underline py-6 ml-12 "
                  >
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="w-full  ml-12 mr-8">
                <div className="">
                  <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <p className="text-xl font-medium">Payment Details</p>
                    <p className="text-gray-400">
                      Complete your order by providing your payment details.
                    </p>
                    <div>
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
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="your.email@gmail.com"
                        />
                      </div>
                      <label
                        htmlFor="card-holder"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Card Holder
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="card-holder"
                          name="card-holder"
                          required
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your full name here"
                        />
                      </div>
                      <label
                        htmlFor="card-no"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Card Details
                      </label>
                      <div className="flex">
                        <div className="relative w-7/12 flex-shrink-0">
                          <input
                            type="text"
                            id="card-no"
                            name="card-no"
                            required
                            pattern="\d{4}-\d{4}-\d{4}-\d{4}"
                            className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                          />
                        </div>
                        <input
                          type="text"
                          name="credit-expiry"
                          required
                          pattern="\d{2}/\d{2}"
                          className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="MM/YY"
                        />
                        <input
                          type="text"
                          name="credit-cvc"
                          required
                          pattern="\d{3}"
                          className="w-1/6 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="CVC"
                        />
                      </div>
                      <label
                        htmlFor="billing-address"
                        className="mt-4 mb-2 block text-sm font-medium"
                      >
                        Address
                      </label>
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative flex-shrink-0 sm:w-7/12">
                          <input
                            type="text"
                            id="billing-address"
                            name="billing-address"
                            required
                            className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Street Address"
                          />
                        </div>
                        <select
                          name="billing-state"
                          required
                          className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="State">State</option>
                          <option value="State">Western Province</option>
                          <option value="State">Central Province</option>
                          <option value="State">Southern Province</option>
                        </select>
                        <input
                          type="number"
                          name="billing-zip"
                          required
                          pattern="\d{4}"
                          className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="bg-blue-300 rounded-lg text-2xl font-medium font-sans text-primary mt-2 mb-6 mx-auto px-10">
                  Order Summary
                </h2>
                <div className="flex w-full py-2 font-sans text-black text-lg text-justify font-bold">
                  <p>Product Name</p>
                  <p className="ml-auto w-32 font-sans text-black text-lg text-justify font-bold">
                    Quantity
                  </p>
                  <p className="ml-auto w-32 font-sans text-black text-lg text-justify font-bold">
                    Total
                  </p>
                </div>
                {/* Render product quantities, totals, and categories */}
                {productCartItem.map((item, index) => (
                  <div key={index} className="flex w-full py-2 text-lg">
                    <p>{item.title}</p>
                    <p className="ml-auto w-34 font-sans text-black text-lg text-justify">
                      {item.qty}
                    </p>
                    <p className="ml-auto w-32 font-sans text-black text-lg text-justify">
                      {item.total}
                    </p>
                  </div>
                ))}
                <div className="border-b"></div>
                <div className="flex w-full py-2 text-lg border-b">
                  <p className="font-sans text-black text-lg font-bold">
                    Total Qty :
                  </p>
                  <p className="ml-auto w-32 font-sans text-black text-lg font-bold">
                    {totalQty}
                  </p>
                </div>
                <div className="flex w-full py-2 font-sans text-black text-lg font-bold border-b">
                  <p>Total Price</p>
                  <p className="ml-auto w-32 ">
                    <span className="text-red-500">Rs.</span> {totalPrice}
                  </p>
                </div>
                <div className="mt-10 ml-[230px]">
                  <DefaultButton title="Purchase Now" />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-center items-center flex-col">
              <img
                src={emptyCartImage}
                className="w-full max-w-sm"
                style={{ marginTop: "50px" }}
                alt="Empty Cart"
              />
              <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
