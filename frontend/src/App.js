<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import CartPage from "./pages/Cart";
// import CheckoutPage from "./pages/Checkout";
// import ProductsPage from "./pages/Shoptest";
import ContactUs from "./pages/ContactUs";
import AdminContactUs from "./pages/Admincontact";
// import AdminProducts from "./admin/admin-products";
// import AdminOrders from "./admin/admin-order";
import Home from "./pages/Home/Home";
import PrimaryHeader from "./components/PrimaryHeader";
import SecondaryHeader from "./components/SecondaryHeader";
import Footer from "./components/home/Footer";
=======
import logo from './logo.svg';
import './App.css';
>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all cart items when the app mounts
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  return (
<<<<<<< HEAD
    <BrowserRouter>
          <PrimaryHeader />
      <SecondaryHeader /> 
     
        <Routes>
        <Route path="/contactus" element={<ContactUs />} />
          <Route path="/admin/contactus" element={<AdminContactUs />} />
          {/* <Route path="/admin/products" element={<AdminProducts />} /> */}
          {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/Register" element={<Register />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
          {/* <Route path="/shop" element={<ProductsPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>

=======
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75
  );
}
export default App;