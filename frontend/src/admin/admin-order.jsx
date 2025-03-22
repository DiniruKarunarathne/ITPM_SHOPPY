import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../utils/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  // Order status options based on your MongoDB model
  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
  ];

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check if user is admin
        if (!apiService.auth.isAuthenticated()) {
          navigate('/login', { state: { from: '/admin/orders', message: 'Please login to access admin panel' } });
          return;
        }

        const user = apiService.auth.getUser();
        if (user.role !== 'admin') {
          navigate('/');
          return;
        }

        setLoading(true);
        const response = await apiService.orders.getAll();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Handle opening order details modal
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setShowOrderDetails(true);
  };

  // Handle updating order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      
      // Call API to update status
      await apiService.orders.updateStatus(orderId, { status: newStatus });
      
      // Update order in state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update current order if details modal is open
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder({ ...currentOrder, status: newStatus });
      }
      
      setUpdatingStatus(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    return order.products.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Filter orders by status and search term
  const filteredOrders = orders.filter(order => {
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    // Filter by search term (match against order ID or customer info)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = order._id.toLowerCase().includes(searchLower) || 
                          (order.user && order.user.name && order.user.name.toLowerCase().includes(searchLower)) ||
                          (order.user && order.user.email && order.user.email.toLowerCase().includes(searchLower));
    
    return matchesStatus && matchesSearch;
  });

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Show loading state
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-64">
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="w-full md:w-72">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {sortedOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No orders found. {orders.length > 0 ? 'Try adjusting your filters.' : ''}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {/* Order ID - shortened for display */}
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.user && order.user.name ? order.user.name : "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user && order.user.email ? order.user.email : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          View
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="border border-gray-300 rounded-md text-sm p-1"
                          disabled={updatingStatus}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Order Details <span className="text-gray-500 text-sm">#{currentOrder._id}</span>
              </h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="text-sm font-medium">{formatDate(currentOrder.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-sm font-medium">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            currentOrder.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : currentOrder.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : currentOrder.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : currentOrder.status === "shipped"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium">
                          {currentOrder.paymentMethod === "credit_card" 
                            ? "Credit Card" 
                            : currentOrder.paymentMethod === "cash_on_delivery" 
                            ? "Cash on Delivery" 
                            : "PayPal"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="text-sm font-medium">
                          {currentOrder.isPaid ? (
                            <span className="text-green-600">Paid</span>
                          ) : (
                            <span className="text-red-600">Unpaid</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="text-sm font-medium">
                        {currentOrder.user && currentOrder.user.name ? currentOrder.user.name : "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentOrder.user && currentOrder.user.email ? currentOrder.user.email : "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="text-sm font-medium">
                        {currentOrder.shippingAddress.address},<br />
                        {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}<br />
                        {currentOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrder.products.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name || `Product ID: ${item.product}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${currentOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold border-t border-gray-200 mt-2 pt-2">
                  <span>Total</span>
                  <span>${currentOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
                <div className="ml-3">
                  <select
                    value={currentOrder.status}
                    onChange={(e) => handleUpdateStatus(currentOrder._id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={updatingStatus}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        Update to: {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;