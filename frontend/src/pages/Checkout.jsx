import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProduct from "../pages/cart/cartproduct";
import emptyCartImage from "../assets/empty.gif";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { fetchAllCartItems } from "../services/redux/productSlice";
import DefaultButton from "../components/home/DefaultButton";
import { toast } from "react-toastify";
import axios from "axios";
// Import libraries for PDF generation
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Main checkout component handling payment process and order display
export default function Checkout() {
  const dispatch = useDispatch();
  const productCartItem = useSelector((state) => state.product.cartItem);
  // Create reference to the order summary section for PDF generation
  const reportRef = useRef(null);

  // Fetch all cart items on component mount
  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  // Calculate total quantity and price from cart items
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );
  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );

  // Handle payment form submission and API interaction
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      email: formData.get("email"),
      holder: formData.get("card-holder"),
      card: formData.get("card-no"),
      expire: formData.get("credit-expiry"),
      cvc: formData.get("credit-cvc"),
      addres: formData.get("billing-address"),
      state: formData.get("billing-state"),
      zip: formData.get("billing-zip"),
      totalQty: totalQty,
      totalPrice: totalPrice,
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/api/createpayment",
        data
      );

      toast.success("Payment successful!");

      console.log("Server response:", response.data);

      // Clear cart after successful payment
      await axios.delete("http://localhost:8082/allcart");

      // Refresh page to show updated cart status
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Error processing payment. Please try again.");
    }
  };

  /**
   * Generate and download a PDF report of the order summary
   * Uses html2canvas to capture the DOM element and jsPDF to create the PDF
   */
  const generateReport = async () => {
    // Check if cart is empty before generating report
    if (productCartItem.length === 0) {
      toast.error("Cannot generate report for an empty cart");
      return;
    }

    try {
      // Show notification that report generation has started
      toast.info("Generating report...");
      
      // Get the DOM element to be captured
      const reportElement = reportRef.current;
      // Create a canvas from the DOM element
      const canvas = await html2canvas(reportElement);
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF document with portrait orientation
      const pdf = new jsPDF('p', 'mm', 'a4');
      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      // Calculate image scaling to fit PDF
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      // Center image horizontally
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      // Position image below the title
      const imgY = 30;
      
      // Add title to PDF document
      pdf.setFontSize(20);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Order Summary Report', pdfWidth / 2, 15, { align: 'center' });
      
      // Add generation date to PDF
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated on: ${date}`, pdfWidth - 15, 10, { align: 'right' });
      
      // Add the captured image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Save PDF with dynamic filename including date
      pdf.save(`Order-Summary-${date}.pdf`);
      
      // Show success notification
      toast.success("Report downloaded successfully!");
    } catch (error) {
      // Handle errors during PDF generation
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-medium font-sans text-blue-900 uppercase mt-4 mb-6 text-center shadow-sm py-2">
        Checkout
      </h2>
      <Link to={"/cart"}>
        <div className="flex cursor-pointer hover:text-blue-500 transition duration-300 mb-6">
          <div className="ml-8">
            <box-icon name="undo" size="40px"></box-icon>
          </div>
          <div className="mt-2 text-gray-500">Back</div>
        </div>
      </Link>
      <div className="mx-auto">
        {productCartItem.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {/* Product carousel to display cart items */}
              <div className="mx-auto rounded-lg shadow-md overflow-hidden" style={{ width: 500, height: 600 }}>
                {productCartItem.length > 0 && (
                  <Carousel
                    autoPlay={false}
                    animation="slide"
                    indicators={true}
                    timeout={500}
                    navButtonsAlwaysVisible={true}
                  >
                    {productCartItem.map((item, index) => (
                      <div key={index} className="w-full max-w-3xl bg-white p-4">
                        <CartProduct
                          id={item._id}
                          images={item.images}
                          categories={item.categories}
                          quantity={item.quantity}
                          price={item.price}
                          description={item.description}
                          title={item.title}
                          total={item.total}
                          qty={item.qty}
                        />
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
              <div className="p-8 flex justify-center">
                <p className="text-center mt-2 my-4 font-semibold">
                  Still want to continue shopping? <br></br>
                  <Link
                    to={"/shop"}
                    className="text-blue-600 hover:text-blue-800 transition duration-300 underline py-6 inline-block"
                  >
                    Continue Shopping
                  </Link>
                </p>
              </div>
              {/* Button to generate and download order report PDF */}
              <div className="flex justify-center">
                <button
                  onClick={generateReport}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-300 flex items-center"
                >
                  <box-icon name="download" color="white" size="20px"></box-icon>
                  <span className="ml-2">Download Order Report</span>
                </button>
              </div>
            </div>

            {/* Payment form with validation patterns */}
            <form onSubmit={handleSubmit} className="md:w-1/2">
              <div className="w-full">
                <div>
                  <div className="bg-gray-50 px-6 py-8 rounded-lg shadow-md">
                    <p className="text-2xl font-medium text-blue-900 mb-2">Payment Details</p>
                    <p className="text-gray-500 mb-6">
                      Complete your order by providing your payment details.
                    </p>
                    <div>
                      <label
                        htmlFor="email"
                        className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          required
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                          className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                          placeholder="your.email@gmail.com"
                        />
                      </div>
                      <label
                        htmlFor="card-holder"
                        className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                      >
                        Card Holder
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="card-holder"
                          name="card-holder"
                          required
                          className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                          placeholder="Your full name here"
                        />
                      </div>
                      <label
                        htmlFor="card-no"
                        className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                      >
                        Card Details
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-7/12 flex-shrink-0">
                          <input
                            type="text"
                            id="card-no"
                            name="card-no"
                            required
                            pattern="\d{4}-\d{4}-\d{4}-\d{4}"
                            className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                          />
                        </div>
                        <input
                          type="text"
                          name="credit-expiry"
                          required
                          pattern="\d{2}/\d{2}"
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                          placeholder="MM/YY"
                        />
                        <input
                          type="text"
                          name="credit-cvc"
                          required
                          pattern="\d{3}"
                          className="w-1/6 flex-shrink-0 rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                          placeholder="CVC"
                        />
                      </div>
                      <label
                        htmlFor="billing-address"
                        className="mt-4 mb-2 block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-shrink-0 sm:w-7/12">
                          <input
                            type="text"
                            id="billing-address"
                            name="billing-address"
                            required
                            className="w-full rounded-md border border-gray-300 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                            placeholder="Street Address"
                          />
                        </div>
                        <select
                          name="billing-state"
                          required
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                        >
                          <option value="State">State</option>
                          <option value="State">Western Province</option>
                          <option value="State">Central Province</option>
                          <option value="State">Southern Province</option>
                        </select>
                        <input
                          type="number"
                          name="billing-zip"
                          required
                          pattern="\d{4}"
                          className="flex-shrink-0 rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Order summary section showing products and totals - referenced for PDF generation */}
                <div ref={reportRef}>
                  <h2 className="bg-blue-500 text-white rounded-lg text-2xl font-medium font-sans mt-8 mb-6 mx-auto px-10 py-3 shadow-md">
                    Order Summary
                  </h2>
                  <div className="flex w-full py-3 px-4 bg-gray-100 rounded-t-lg font-sans text-black text-lg font-bold">
                    <p>Product Name</p>
                    <p className="ml-auto w-32 font-sans text-black text-lg text-center font-bold">
                      Quantity
                    </p>
                    <p className="ml-auto w-32 font-sans text-black text-lg text-center font-bold">
                      Total
                    </p>
                  </div>
                  {/* Map through cart items to display in order summary */}
                  <div className="bg-white rounded-b-lg shadow-md mb-6">
                    {productCartItem.map((item, index) => (
                      <div key={index} className="flex w-full py-3 px-4 text-lg border-b border-gray-100">
                        <p className="truncate max-w-xs">{item.title}</p>
                        <p className="ml-auto w-32 font-sans text-black text-lg text-center">
                          {item.qty}
                        </p>
                        <p className="ml-auto w-32 font-sans text-black text-lg text-center">
                          {item.total}
                        </p>
                      </div>
                    ))}
                    <div className="border-b border-gray-200"></div>
                    <div className="flex w-full py-3 px-4 text-lg border-b border-gray-200 bg-gray-50">
                      <p className="font-sans text-black text-lg font-bold">
                        Total Qty:
                      </p>
                      <p className="ml-auto w-32 font-sans text-black text-lg font-bold text-center">
                        {totalQty}
                      </p>
                    </div>
                    <div className="flex w-full py-3 px-4 font-sans text-black text-lg font-bold bg-gray-100 rounded-b-lg">
                      <p>Total Price</p>
                      <p className="ml-auto w-32 text-center">
                        <span className="text-red-500">Rs.</span> {totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <DefaultButton title="Purchase Now" />
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Display empty cart message and image when no items */}
            <div className="flex w-full justify-center items-center flex-col bg-white rounded-lg shadow-md py-10">
              <img
                src={emptyCartImage}
                className="w-full max-w-sm"
                style={{ marginTop: "50px" }}
                alt="Empty Cart"
              />
              <p className="text-slate-500 text-3xl font-bold mt-6">Empty Cart</p>
              <Link
                to={"/shop"}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}