import React, { useEffect, useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import registerImage from "../assets/images/register.jpg";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../auth/redux/authActions";

function Register() {
  const { success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const handleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleUploadProfileImage = async (e) => {
    const imageData = await ImagetoBase64(e.target.files[0]);
    setData((prev) => ({ ...prev, image: imageData }));
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "First name is required";
        } else if (value.trim().length < 2) {
          newErrors.firstName = "First name must be at least 2 characters";
        } else {
          delete newErrors.firstName;
        }
        break;
        
      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Last name is required";
        } else if (value.trim().length < 2) {
          newErrors.lastName = "Last name must be at least 2 characters";
        } else {
          delete newErrors.lastName;
        }
        break;
        
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
        
      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*[0-9])/.test(value)) {
          newErrors.password = "Password must contain at least one number";
        } else {
          delete newErrors.password;
        }
        
        // Also check confirm password match if it's been entered
        if (data.confirmPassword && value !== data.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else if (data.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
        
      case "confirmPassword":
        if (!value.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== data.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(data).forEach(key => {
      if (key !== "image") {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);
    
    // Validate all fields
    let isValid = true;
    let newErrors = {};
    
    if (!data.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (data.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }
    
    if (!data.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (data.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!data.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(data.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(data.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(data.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    }
    
    if (!data.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(registerUser(data));
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-center ml-[50px]">
      <div className="p-3 md:p-4 md:mr-4 mt-[40px]">
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
            <p className="text-sm text-gray-600 mt-1">Sign up to get started</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input type="file" accept="image/*" onChange={handleUploadProfileImage} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={handleOnChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.firstName && touched.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={handleOnChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.lastName && touched.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                onBlur={handleBlur}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  onBlur={handleBlur}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    errors.password && touched.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleShowPassword}>
                  {showPassword ? <BiHide /> : <BiShow />}
                </span>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  onBlur={handleBlur}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                    errors.confirmPassword && touched.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleShowConfirmPassword}>
                  {showConfirmPassword ? <BiHide /> : <BiShow />}
                </span>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <button className="w-full flex justify-center py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
              Sign up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Login</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2">
        <img
          src={registerImage}
          alt="Register"
          className="w-[600px] h-[800px] mt-[100px] ml-[100px]"
        />
      </div>
    </div>
  );
}

export default Register;