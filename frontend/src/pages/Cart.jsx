import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "../pages/cart/cartproduct";
import emptyCartImage from "../assets/empty.gif";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchAllCartItems } from "../services/redux/productSlice";
import DefaultButton from "../components/home/DefaultButton";

export default function Cart() {
  const dispatch = useDispatch();
  const productCartItem = useSelector((state) => state.product.cartItem);

  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  console.log(" cart item rergdwdqwdwqdwdwdwdwregg", productCartItem);
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );
  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-medium font-sans uppercase mt-2 mb-2 mx-auto md:px-10 text-blue-900 text-center md:text-left">
        Your Cart Items
      </h2>
      <Link to={"/shop"}>
        <div className="flex cursor-pointer justify-center md:justify-start md:ml-32 mb-4">
          <div>
            <box-icon name="undo" size="md"></box-icon>
          </div>
          <div className="mt-2 text-gray-400 ml-2">Back</div>
        </div>
      </Link>

      <div>
        {productCartItem.length > 0 ? (
          <div className="container mx-auto flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 lg:w-5/12 mx-auto md:mx-0 md:ml-4 lg:ml-20 mb-8 md:mb-0" style={{ minHeight: "400px", maxHeight: "600px" }}>
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

            <div className="w-full md:w-1/2 lg:w-7/12 px-4">
              <h2 className="bg-blue-300 rounded-lg text-xl md:text-2xl font-medium font-sans text-primary mt-2 mb-6 mx-auto px-4 md:px-10 py-2 text-center">
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
              <div className="max-h-64 overflow-y-auto">
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
              <div className="mt-8 flex justify-center md:justify-start md:ml-32">
                <Link to={"/checkout"}>
                  <DefaultButton title="Checkout" />
                </Link>
              </div>
            </div>
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
      <div className="p-4 md:p-16 text-center md:text-left">
        <p className="text-lg md:text-xl mt-2 my-4 md:ml-48 font-semibold">
          Still want to continue shopping?<br className="md:hidden" />
          <Link to={"/shop"} className="text-blue-800 underline py-2 md:py-6 md:ml-12 inline-block">
            Continue Shopping
          </Link>
        </p>
      </div>
    </div>
  );
}