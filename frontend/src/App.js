import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import ProductsPage from "./pages/Shoptest";
import ContactUs from "./pages/contactus";
import AdminContactUs from "./admin/admin-contactus";
import AdminProducts from "./admin/admin-products";
import AdminOrders from "./admin/admin-order";
import Home from "./pages/Home/Home";
import PrimaryHeader from "./components/PrimaryHeader";
import SecondaryHeader from "./components/SecondaryHeader";
import Footer from "./components/home/Footer";

function App() {
  return (
    <BrowserRouter>
          <PrimaryHeader />
      <SecondaryHeader /> 
     
        <Routes>
        <Route path="/contactus" element={<ContactUs />} />
          <Route path="/admin/contactus" element={<AdminContactUs />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/shop" element={<ProductsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>

  );
}
export default App;