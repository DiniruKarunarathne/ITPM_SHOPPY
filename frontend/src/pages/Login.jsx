import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../auth/redux/authActions";
import LoginForm from "../components/form/LoginForm";
import { AuthContext } from "../context/authContext";

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
  const [touched, setTouched] = useState({});
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
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };
  
  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
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
        } else {
          delete newErrors.password;
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
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    
    // Validate all fields
    let isValid = true;
    let newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(formData);
      dispatch(userLogin(formData));
    }
  };

  // Add the onBlur handler to be passed to LoginForm
  const onBlur = handleBlur;

  return (
    <div className="flex items-center justify-between h-full">
      <div className="w-1/2">
        <img src={loginImage} alt="Login" className="w-full h-full" />
      </div>
      <div className="flex items-center justify-center w-1/2">
        <LoginForm
          email={email}
          password={password}
          onChange={onChange}
          onBlur={onBlur}
          handleSubmit={handleSubmit}
          errors={errors}
          touched={touched}
        />
      </div>
    </div>
  );
}

export default Login;