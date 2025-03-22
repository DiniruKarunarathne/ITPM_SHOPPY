import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";


import App from "./App";

import { CartProvider } from "./context/cartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    
        <React.StrictMode>
           
                <CartProvider>
                    <App />
                </CartProvider>
           
        </React.StrictMode>
   
);
