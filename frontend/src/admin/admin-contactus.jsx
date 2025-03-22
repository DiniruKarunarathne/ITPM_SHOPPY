import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver"; // For CSV download
import { jsPDF } from "jspdf"; // For PDF download
import "jspdf-autotable"; // For PDF table generation
import apiService from "../utils/api";
import { useNavigate } from "react-router-dom";

const AdminContactUs = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch contact messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // First check if user is admin
        if (!apiService.auth.isAuthenticated()) {
          navigate('/login', { state: { from: '/admin/contact', message: 'Please login to access admin panel' } });
          return;
        }

        const user = apiService.auth.getUser();
        if (user.role !== 'admin') {
          navigate('/');
          return;
        }

        setLoading(true);
        const response = await apiService.contact.getAll();
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact messages:', err);
        setError('Failed to load contact messages. Please try again.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [navigate]);

  // Function to handle message deletion
  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        // In a real implementation, you'd call an API to delete the message
        // await apiService.contact.delete(id);
        
        // For now, we'll just filter it out from the state
        setMessages(messages.filter(msg => msg._id !== id));
      } catch (err) {
        console.error('Error deleting message:', err);
        alert('Failed to delete message. Please try again.');
      }
    }
  };

  // Function to generate and download CSV report
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Date"];
    const csvContent =
      headers.join(",") +
      "\n" +
      messages
        .map((msg) =>
          [
            msg.name, 
            msg.email, 
            msg.subject, 
            msg.message.replace(/,/g, ";"), // Replace commas in message to prevent CSV issues
            new Date(msg.createdAt).toLocaleString()
          ].join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "contact_messages.csv");
  };

  // Function to generate and download PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("Contact Us Messages Report", 14, 22);

    // Define table columns
    const columns = ["Name", "Email", "Subject", "Message", "Date"];

    // Map messages to table rows
    const rows = messages.map((msg) => [
      msg.name,
      msg.email,
      msg.subject,
      // Truncate long messages to fit in PDF
      msg.message.length > 40 ? msg.message.substring(0, 40) + "..." : msg.message,
      new Date(msg.createdAt).toLocaleString()
    ]);

    // Add the table to the PDF
    doc.autoTable({
      head: [columns], // Table header
      body: rows, // Table data
      startY: 30, // Start table below the title
      theme: "striped", // Add styling to the table
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save("contact_messages.pdf");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Contact Messages
        </h1>

        {/* Report Generation Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={downloadCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Messages Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Total messages: <span className="font-semibold">{messages.length}</span>
          </p>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No contact messages found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {msg.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`mailto:${msg.email}`} className="text-indigo-600 hover:text-indigo-900">
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {msg.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        <div className="truncate max-w-xs">
                          {msg.message}
                        </div>
                        <button
                          className="text-xs text-indigo-600 hover:text-indigo-900 mt-1"
                          onClick={() => alert(msg.message)}
                        >
                          View Full
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactUs;