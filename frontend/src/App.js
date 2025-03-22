import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import store from "./auth/redux/store"

import ContactUs from "./pages/contactus";
import AdminContactUs from "./admin/admin-contactus";
import Home from "./pages/Home/Home";



import PrimaryHeader from "./components/PrimaryHeader";
import SecondaryHeader from "./components/SecondaryHeader";
import { Provider } from "react-redux";
import Footer from "./components/home/Footer";




function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>

      <PrimaryHeader />
      <SecondaryHeader /> 
     


      

       
        {/* Apply margin top to the content after the Header */}
        <Routes>
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/admin/contactus" element={<AdminContactUs />} />
          <Route path="/" element={<Home />} />
          

        {/* <Feedback /> */}

        
      </Routes>
      <Footer />
    </BrowserRouter>
    </Provider>
  );
}

export default App;
