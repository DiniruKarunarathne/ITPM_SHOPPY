import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./auth/redux/store";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./context/authContext"; // ✅ Import the Provider

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider> {/* ✅ Wrap inside AuthContextProvider */}
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
          <ToastContainer position="bottom-center" autoClose={5000} theme="dark" />
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
