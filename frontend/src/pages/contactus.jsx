import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">Contact Us</h1>
          <div className="flex justify-center items-center text-gray-300 mt-2">
            <a href="/" className="hover:text-pink-500">Home</a>
            <span className="mx-2">/</span>
            <span className="text-pink-500">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Contact Information and Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Our Location</h3>
                    <p className="text-gray-600 mt-1">123 RafCart Street, Shopping Avenue, NY 10001, USA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone Number</h3>
                    <p className="text-gray-600 mt-1">+1 (234) 567-8900</p>
                    <p className="text-gray-600">+1 (234) 567-8901</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email Address</h3>
                    <p className="text-gray-600 mt-1">support@rafcart.com</p>
                    <p className="text-gray-600">info@rafcart.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Working Hours</h3>
                    <p className="text-gray-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22,12.14c0-5.52-4.48-10-10-10s-10,4.48-10,10c0,5,3.66,9.14,8.44,9.86v-7h-2.54v-2.86h2.54V9.86c0-2.52,1.5-3.91,3.77-3.91c1.09,0,2.23,0.2,2.23,0.2v2.46h-1.26c-1.24,0-1.63,0.77-1.63,1.56v1.88h2.78l-0.45,2.86h-2.33v7C18.34,21.28,22,17.14,22,12.14z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2.16c3.2,0,3.58,0.01,4.85,0.07c1.17,0.05,1.8,0.25,2.23,0.41c0.56,0.22,0.96,0.48,1.38,0.9c0.42,0.42,0.68,0.82,0.9,1.38c0.16,0.42,0.36,1.06,0.41,2.23c0.06,1.27,0.07,1.65,0.07,4.85c0,3.2-0.01,3.58-0.07,4.85c-0.05,1.17-0.25,1.8-0.41,2.23c-0.22,0.56-0.48,0.96-0.9,1.38c-0.42,0.42-0.82,0.68-1.38,0.9c-0.42,0.16-1.06,0.36-2.23,0.41c-1.27,0.06-1.65,0.07-4.85,0.07c-3.2,0-3.58-0.01-4.85-0.07c-1.17-0.05-1.8-0.25-2.23-0.41c-0.56-0.22-0.96-0.48-1.38-0.9c-0.42-0.42-0.68-0.82-0.9-1.38c-0.16-0.42-0.36-1.06-0.41-2.23c-0.06-1.27-0.07-1.65-0.07-4.85c0-3.2,0.01-3.58,0.07-4.85c0.05-1.17,0.25-1.8,0.41-2.23c0.22-0.56,0.48-0.96,0.9-1.38c0.42-0.42,0.82-0.68,1.38-0.9c0.42-0.16,1.06-0.36,2.23-0.41C8.42,2.17,8.8,2.16,12,2.16M12,0C8.74,0,8.33,0.01,7.05,0.07C5.78,0.13,4.9,0.33,4.15,0.63C3.38,0.93,2.72,1.34,2.06,2C1.4,2.66,0.93,3.38,0.63,4.15C0.33,4.9,0.13,5.78,0.07,7.05C0.01,8.33,0,8.74,0,12c0,3.26,0.01,3.67,0.07,4.95c0.06,1.27,0.26,2.15,0.56,2.9c0.3,0.77,0.71,1.43,1.37,2.09c0.66,0.66,1.38,1.13,2.15,1.43c0.75,0.3,1.63,0.5,2.9,0.56C8.33,23.99,8.74,24,12,24c3.26,0,3.67-0.01,4.95-0.07c1.27-0.06,2.15-0.26,2.9-0.56c0.77-0.3,1.43-0.71,2.09-1.37c0.66-0.66,1.13-1.38,1.43-2.15c0.3-0.75,0.5-1.63,0.56-2.9C23.99,15.67,24,15.26,24,12c0-3.26-0.01-3.67-0.07-4.95c-0.06-1.27-0.26-2.15-0.56-2.9c-0.3-0.77-0.71-1.43-1.37-2.09c-0.66-0.66-1.38-1.13-2.15-1.43c-0.75-0.3-1.63-0.5-2.9-0.56C15.67,0.01,15.26,0,12,0z M12,5.84c-3.4,0-6.16,2.76-6.16,6.16c0,3.4,2.76,6.16,6.16,6.16c3.4,0,6.16-2.76,6.16-6.16C18.16,8.6,15.4,5.84,12,5.84z M12,16c-2.21,0-4-1.79-4-4c0-2.21,1.79-4,4-4s4,1.79,4,4C16,14.21,14.21,16,12,16z M18.41,4.15c-0.8,0-1.44,0.64-1.44,1.44c0,0.8,0.64,1.44,1.44,1.44c0.8,0,1.44-0.64,1.44-1.44C19.85,4.79,19.21,4.15,18.41,4.15z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46,6c-0.77,0.35-1.6,0.58-2.46,0.69c0.88-0.53,1.56-1.37,1.88-2.38c-0.83,0.5-1.75,0.85-2.72,1.05C18.37,4.5,17.26,4,16,4c-2.35,0-4.27,1.92-4.27,4.29c0,0.34,0.04,0.67,0.11,0.98C8.28,9.09,5.11,7.38,3,4.79c-0.37,0.63-0.58,1.37-0.58,2.15c0,1.49,0.75,2.81,1.91,3.56c-0.71,0-1.37-0.2-1.95-0.5c0,0.02,0,0.03,0,0.05c0,2.08,1.48,3.82,3.44,4.21c-0.36,0.1-0.74,0.15-1.13,0.15c-0.27,0-0.54-0.03-0.8-0.08c0.54,1.69,2.11,2.95,3.98,2.98c-1.46,1.16-3.3,1.84-5.33,1.84c-0.35,0-0.69-0.02-1.02-0.06c1.9,1.22,4.16,1.93,6.58,1.93c7.88,0,12.21-6.54,12.21-12.21c0-0.19,0-0.37-0.01-0.56C21.14,7.63,21.88,6.87,22.46,6z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.58,7.19c-0.23-0.86-0.91-1.54-1.77-1.77C18.25,5,12,5,12,5S5.75,5,4.19,5.42c-0.86,0.23-1.54,0.91-1.77,1.77C2,8.75,2,12,2,12s0,3.25,0.42,4.81c0.23,0.86,0.91,1.54,1.77,1.77C5.75,19,12,19,12,19s6.25,0,7.81-0.42c0.86-0.23,1.54-0.91,1.77-1.77C22,15.25,22,12,22,12S22,8.75,21.58,7.19z M10,15V9l5.2,3L10,15z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">Have a question, feedback, or need assistance? Fill out the form below and we'll get back to you as soon as possible.</p>
              
              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                </div>
              )}
              
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                  </svg>
                  <span>Something went wrong. Please try again later.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="johndoe@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                </div>
                
                <div className="mt-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message <span className="text-red-500">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Write your message here..."
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pink-500 text-white py-2 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Our Location</h2>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1616403296916!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{border: 0}} 
              allowFullScreen="" 
              loading="lazy"
              title="RafCart Store Location"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50">
                <span className="font-medium text-gray-800">How can I track my order?</span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="px-4 pb-4">
                <p className="text-gray-600">
                  You can track your order by logging into your account and visiting the "My Orders" section. Alternatively, you can use the tracking number provided in your shipping confirmation email.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50">
                <span className="font-medium text-gray-800">What is your return policy?</span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="px-4 pb-4">
                <p className="text-gray-600">
                  We offer a 30-day return policy for most items. Products must be returned in their original condition and packaging. Some items may be subject to restocking fees.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50">
                <span className="font-medium text-gray-800">How can I cancel my order?</span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="px-4 pb-4">
                <p className="text-gray-600">
                  If your order hasn't been shipped yet, you can cancel it through your account. Otherwise, please contact our customer service team for assistance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">Don't see your question here? Contact our customer support team.</p>
            <a href="#" className="inline-block mt-4 text-pink-500 font-medium hover:text-pink-600 hover:underline">
              View all FAQs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;