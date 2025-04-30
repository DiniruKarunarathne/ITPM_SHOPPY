import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./main.css";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { Provider } from "react-redux";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider>
    <React.StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </React.StrictMode>
    </Provider>
);
