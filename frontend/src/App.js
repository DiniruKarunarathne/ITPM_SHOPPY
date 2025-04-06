import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchAllCartItems } from "./services/redux/productSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FooterSecondary from "./components/FooterSecondary";

import Shop from "./pages/shop";
import Cart from "./pages/Cart";

import { ToastContainer, toast } from "react-toastify";
import Checkout from "./pages/Checkout";




function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all cart items when the app mounts
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div style={{ marginTop: "10%" }}>
        <FooterSecondary />
      </div>
    </BrowserRouter>
  );
}

export default App;
