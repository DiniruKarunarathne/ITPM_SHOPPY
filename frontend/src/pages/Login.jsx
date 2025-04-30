import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../auth/redux/authActions";
import LoginForm from "../components/form/LoginForm";
import { AuthContext } from "../context/authContext";
import LogingHeading from "../components/LoginHeading";
import loginImage from "../assets/images/login.jpg";

function Login() {
  const { userInfo } = useSelector((state) => state.auth);
  const { getUserRoles } = useContext(AuthContext);
  const userRoles = getUserRoles();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      // Check if "User" role is included in the roles array
      if (userInfo.roles.includes("User")) {
        navigate("/");
        window.location.reload();

      } else if (userInfo.roles.includes("Seller")) {
        navigate("/selleritem");

        window.location.reload();
      }
    }
  }, [navigate, userInfo]);

  const { email, password } = formData;

  const onChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(formData);
      dispatch(userLogin(formData));
    }
  };

  return (
    <div className="flex items-center justify-between h-full">
      <div className="w-1/2">
        <img src={loginImage} alt="Login" className="w-full h-full" />
      </div>
      <div className="flex items-center justify-center w-1/2">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <LogingHeading />
          <LoginForm
            email={email}
            password={password}
            onChange={onChange}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
