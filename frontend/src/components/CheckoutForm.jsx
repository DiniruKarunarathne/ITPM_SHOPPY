import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DefaultButton from "../components/home/DefaultButton";
import CheckoutAddress from "./CheckoutAddres";
import { default as api } from "../services/redux/checkoutSlice";

function CheckoutForm() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCheckoutAddress, setShowCheckoutAddress] = useState(true);
  
  const { register, handleSubmit, reset } = useForm();
  const [addPaymentDetails] = api.useAddPaymentDetailsMutation();

  const onSubmit = async (data) => {
    if (!data) return {};
    await addPaymentDetails(data).unwrap();
    reset();
    console.log("Payment details data ", data);
  };



  useEffect(() => {
    setShowCheckoutAddress(true);
  }, []);



  const handleContinueButtonClick = () => {
    setShowCheckoutAddress(true);
    setShowAddressForm(false); // Hide address form
  };

  return (
    <div>
      <div className="px-4 pt-4">
        <p className="mt-8 text-lg font-bold">
          Which payment card would you like to use ?
        </p>
      </div>

      
    

    
 
       

    
    </div>
  );
}

export default CheckoutForm;