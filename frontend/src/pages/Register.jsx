import React, { useEffect, useState } from "react";
import loginSignupImage from "../assets/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../auth/redux/authActions";

function Register() {
  const { success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

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
  };

  const handleUploadProfileImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    setData((prev) => ({
      ...prev,
      image: data,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords before submitting
    if (validatePasswords()) {
      dispatch(registerUser(data));
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
                src={data.image ? data.image : loginSignupImage}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            
            <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-red-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-red-600 transition-colors duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleUploadProfileImage}
              />
            </label>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  value={data.firstName}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  value={data.lastName}
                  onChange={handleOnChange}
                  required
                />
              </div>
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
              >
                Sign Up
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