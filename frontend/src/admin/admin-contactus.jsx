import React, { useState } from "react";
import { saveAs } from "file-saver"; // For CSV download
import { jsPDF } from "jspdf"; // For PDF download
import "jspdf-autotable"; // For PDF table generation

const AdminContactUs = () => {
  // Sample data for user messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      subject: "Product Inquiry",
      message: "I would like to know more about your product.",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Support Request",
      message: "I need help with my account.",
      status: "Resolved",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      subject: "Feedback",
      message: "Great service! Keep it up.",
      status: "Pending",
    },
  ]);

  // Function to update message status
  const updateStatus = (id, newStatus) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      )
    );
  };

  // Function to delete a message
  const deleteMessage = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  // Function to generate and download CSV report
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Status"];
    const csvContent =
      headers.join(",") +
      "\n" +
      messages
        .map((msg) =>
          [msg.name, msg.email, msg.subject, msg.message, msg.status].join(",")
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
    const columns = ["Name", "Email", "Subject", "Message", "Status"];

    // Map messages to table rows
    const rows = messages.map((msg) => [
      msg.name,
      msg.email,
      msg.subject,
      msg.message,
      msg.status,
    ]);

    // Add the table to the PDF
    doc.autoTable({
      head: [columns], // Table header
      body: rows, // Table data
      startY: 30, // Start table below the title
      theme: "striped", // Add styling to the table
    });

    // Save the PDF
    doc.save("contact_messages.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Contact Us Messages
        </h1>

        {/* Report Generation Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={downloadCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Download PDF
          </button>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {msg.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {msg.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {msg.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {msg.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        updateStatus(
                          msg.id,
                          msg.status === "Pending" ? "Resolved" : "Pending"
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      {msg.status === "Pending" ? "Mark Resolved" : "Mark Pending"}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContactUs;