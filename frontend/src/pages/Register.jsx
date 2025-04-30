import React, { useEffect, useState } from "react";
import loginSignupImage from "../assets/login-animation.gif";
import registerImage from "../assets/images/register.jpg";
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success]);

  const { firstName, lastName, email, password, confirmPassword, image } = data;

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
  };

  const handleUploadProfileImage = async (e) => {
    const imageData = await ImagetoBase64(e.target.files[0]);
    setData((prev) => ({
      ...prev,
      image: imageData,
    }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(registerUser(data));
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-center ml-[100px]">
      <div className="p-3 md:p-4 md:mr-4 mt-[90px]">
        <div className="flex flex-col w-full max-w-md p-4 m-auto bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Create An Account
          </h2>
          <div className="relative mb-4">
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfileImage}
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 w-full text-center transition-all duration-300 ease-in-out cursor-pointer bg-slate-500 rounded-b-md hover:bg-slate-600 hover:text-white"
            >
              Upload
            </label>
            <div className="mx-auto overflow-hidden rounded-full shadow-md w-28 h-28">
              <img
                src={data.image ? data.image : loginSignupImage}
                className="object-cover w-full h-full"
                alt=""
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-1 font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.firstName ? "border border-red-500" : ""
                }`}
                value={firstName}
                onChange={handleOnChange}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">{errors.firstName}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block mb-1 font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.lastName ? "border border-red-500" : ""
                }`}
                value={lastName}
                onChange={handleOnChange}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">{errors.lastName}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.email ? "border border-red-500" : ""
                }`}
                value={email}
                onChange={handleOnChange}
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                    errors.password ? "border border-red-500" : ""
                  }`}
                  value={password}
                  onChange={handleOnChange}
                />
                <span
                  className="absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <BiHide /> : <BiShow />}
                </span>
              </div>
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full px-3 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                    errors.confirmPassword ? "border border-red-500" : ""
                  }`}
                  value={confirmPassword}
                  onChange={handleOnChange}
                />
                <span
                  className="absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
                  onClick={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? <BiHide /> : <BiShow />}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
            <button className="w-full py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
              Sign up
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2">
        <img
          src={registerImage}
          alt="Register"
          className="w-[500px] h-[700px] mt-[100px] ml-[200px]"
        />
      </div>
    </div>
  );
}

export default Register;
