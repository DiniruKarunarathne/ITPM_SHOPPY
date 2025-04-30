import React, { useState } from "react";
import contact from "../assets/images/contact.jpg";
import DefaultButton from "../components/home/DefaultButton";
import { useForm } from "react-hook-form";
import { useAddContactMutation } from "../components/Store/apiSlice";

// Enhanced Success Popup Component
const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-4 relative z-10 animate-fadeIn">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 text-xl font-bold mb-2">Success!</p>
          <p className="text-gray-600 text-center mb-6">Your message has been sent successfully.</p>
          <button 
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none" 
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};

export default function ContactUs({ ContactData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const [addContact] = useAddContactMutation();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const onSubmit = async (data) => {
    if (!data) return {};

    try {
      // Populate date field with current date
      const currentDate = new Date().toLocaleDateString();
      data.date = currentDate;

      await addContact(data).unwrap();
      setShowSuccessPopup(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-100 py-16 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Image */}
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={contact} 
                alt="contact" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
                <p className="text-gray-600">We'd love to hear from you. Fill out the form below.</p>
              </div>
              
              <form id="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-800 font-semibold mb-2 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className={`w-full h-12 px-4 border-2 rounded-md shadow-sm transition-colors duration-200 
                      ${errors.name 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300 focus:border-primary focus:outline-none'
                      }`}
                    {...register("name", {
                      required: 'Name is required',
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: 'Enter a valid name without special characters or numbers',
                      },
                    })}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-800 font-semibold mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    className={`w-full h-12 px-4 border-2 rounded-md shadow-sm transition-colors duration-200
                      ${errors.email 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300 focus:border-primary focus:outline-none'
                      }`}
                    {...register("email", {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-800 font-semibold mb-2 text-sm">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      maxLength={250}
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-3 border-2 rounded-md shadow-sm transition-colors duration-200
                        ${errors.message 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 bg-white hover:border-blue-300 focus:border-primary focus:outline-none'
                        }`}
                      {...register("message", { required: 'Message is required' })}
                    ></textarea>
                    <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1 rounded">
                      Max 250 characters
                    </div>
                  </div>
                  {errors.message && <p className="text-red-500 text-sm mt-1 font-medium">
                    {errors.message.type === "required" ? "Message is required" : "Message must be less than 250 characters"}
                  </p>}
                </div>

                {/* Hidden date field */}
                <input type="hidden" id="date" name="date" />

                <div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />}
    </div>
  );
}