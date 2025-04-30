import React, { useState } from "react";
import Contactustable from "../components/Contactustable";
import {
  useGet_ContactusQuery,
  useAddContactMutation,
  useDeleteContactMutation,
} from "../components/Store/apiSlice";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Admincontact() {
  // Fetch contact data
  const { data: contacts, error, isLoading, refetch } = useGet_ContactusQuery();

  // Add new contact
  const [addContact] = useAddContactMutation();
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    message: "",
    date: "" // Add date field
  });

  // State for popup visibility
  const [showPopup, setShowPopup] = useState(false);

  const handleAddContact = async () => {
    try {
      // Populate date field with current date
      const currentDate = new Date().toLocaleDateString();
      setNewContact(prevState => ({ ...prevState, date: currentDate }));

      // Add contact
      await addContact(newContact).unwrap();
      setNewContact({ name: "", email: "", message: "", date: "" }); // Clear input fields after successful addition
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  // Delete contact
  const [deleteContact] = useDeleteContactMutation();

  const handleDeleteContact = async (contactId) => {
    try {
      await deleteContact({ id: contactId }).unwrap();
      // Refetch contact data after deletion
      refetch();
      // Show popup after successful deletion
      setShowPopup(true);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text("Contact Report", 10, 10);

    // Add heading for customer inquiries
    doc.text("Customer Inquiries", 10, 20);

    // Define column headers
    const headers = ["Name", "Email", "Message", "Date"];

    // Define data for the table
    const data = contacts.map(contact => [contact.name, contact.email, contact.message, contact.date]);

    // Create a table with headers and data
    doc.autoTable({
      startY: 30, // Start Y position of the table
      head: [headers], // Table headers
      body: data // Table data
    });

    // Save the PDF
    doc.save("contact_report.pdf");
  };

  if (isLoading) {
    return <div className="container mx-auto">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto">
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-start">
      <div className="flex justify-between w-full items-center mb-4"> {/* Flex container for button and heading */}
        <h1 className="text-3xl font-bold">Admin Contacts</h1>
        <div>
          <button onClick={generatePDF} className="bg-primary border border-primary text-white px-8 py-3 font-medium 
              rounded-md hover:bg-blue-800 hover:text-white cursor-grab mt-5">
            Generate Report
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <p className=" text-rose-950 text-lg font-bold">Record deleted successfully!</p>
            
            <button  className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800" onClick={() => setShowPopup(false)   }>Done</button>
          </div>
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <Contactustable contacts={contacts ?? []} onDelete={handleDeleteContact} />
      </div>
    </div>
  );
}

export default Admincontact;
