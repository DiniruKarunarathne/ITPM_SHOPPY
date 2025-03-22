import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/auth/redux/store"; // Store එක import කරන්න
import { AuthContextProvider } from "./context/authContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>Home Page</div>} /> {/* Temporary */}
            <Route path="/Register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;