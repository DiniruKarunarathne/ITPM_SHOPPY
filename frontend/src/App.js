import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchAllCartItems } from "./services/redux/productSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home/Home";
import PrimaryHeader from "./components/PrimaryHeader";
import SecondaryHeader from "./components/SecondaryHeader";
import Seller from "./pages/Seller";

import FooterSecondary from "./components/FooterSecondary";

import Item from "./pages/seller/Item";
import Selleritem from "./pages/seller/selleritem";
import UpdateItem from "./pages/seller/UpdateItem";
import SellerDashboard from "./pages/seller/SellerDashboard";
import { ToastContainer, toast } from "react-toastify";





function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all cart items when the app mounts
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster />
      <PrimaryHeader />
      <SecondaryHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller" element={<Seller />} />

        <Route path="/item" element={<Item />} />
        <Route path="/sellerDashboard" element={<SellerDashboard />} />
        <Route path="/selleritem" element={<Selleritem />} />
        <Route path="/UpdateItem/:id/edit" element={<UpdateItem />} />
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
