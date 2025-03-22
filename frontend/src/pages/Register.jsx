import React, { useState } from "react";
import loginSignupImage from "../assets/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import apiService from "../utils/api";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types in either password field
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
    
    // Clear general error
    setError("");
  };

  const validatePasswords = () => {
    if (data.password !== data.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (data.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate data before submitting
    if (!validatePasswords() || !validatePhone()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the registration API using the wrapper
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password
      };
      
      await apiService.auth.register(userData);
      
      // Show success message and redirect to login
      alert("Registration successful! Please login.");
      navigate("/login");
      
    } catch (err) {
      // Handle registration errors
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br to-gray-100 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">
        <div className="px-6 py-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Create An Account
          </h2>
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
              <img
                src={loginSignupImage}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={data.name}
                onChange={handleOnChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={data.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={data.phone}
                onChange={handleOnChange}
                placeholder="10-digit phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full px-4 py-2 bg-gray-50 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-10`}
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-red-500"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <BiShow className="text-xl" /> : <BiHide className="text-xl" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmpassword"
                  name="confirmPassword"
                  className={`w-full px-4 py-2 bg-gray-50 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-10`}
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-red-500"
                  onClick={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? <BiShow className="text-xl" /> : <BiHide className="text-xl" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-red-500 hover:text-red-600 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;