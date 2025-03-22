import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../utils/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "electronics",
    stock: "",
    images: []
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Categories based on your backend model
  const categories = [
    "electronics", 
    "clothing", 
    "books", 
    "home", 
    "beauty", 
    "sports", 
    "other"
  ];

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if user is admin
        if (!apiService.auth.isAuthenticated()) {
          navigate('/login', { state: { from: '/admin/products', message: 'Please login to access admin panel' } });
          return;
        }

        const user = apiService.auth.getUser();
        if (user.role !== 'admin') {
          navigate('/');
          return;
        }

        setLoading(true);
        const response = await apiService.products.getAll();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Handle file input change
  const handleFileChange = (e) => {
    setNewProduct({
      ...newProduct,
      images: e.target.files
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert to number for price and stock
    if (name === 'price' || name === 'stock') {
      const numValue = parseFloat(value);
      setNewProduct({
        ...newProduct,
        [name]: numValue >= 0 ? value : "0"
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newProduct.name.trim()) errors.name = "Name is required";
    if (!newProduct.description.trim()) errors.description = "Description is required";
    if (!newProduct.price) errors.price = "Price is required";
    if (parseFloat(newProduct.price) <= 0) errors.price = "Price must be greater than 0";
    if (!newProduct.stock) errors.stock = "Stock is required";
    if (parseInt(newProduct.stock) < 0) errors.stock = "Stock cannot be negative";
    if (!newProduct.images || newProduct.images.length === 0) errors.images = "At least one image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle product creation
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Create product with images
      const response = await apiService.products.create(newProduct);
      
      // Add new product to state
      setProducts([...products, response.data]);
      
      // Reset form and close modal
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "electronics",
        stock: "",
        images: []
      });
      setShowAddModal(false);
      setLoading(false);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product. Please try again.');
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeleteLoading(id);
        await apiService.products.delete(id);
        
        // Remove from state
        setProducts(products.filter(product => product._id !== id));
        setDeleteLoading(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
        setDeleteLoading(null);
      }
    }
  };

  // Filter products by category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-64">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="w-full md:w-72">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name or description..."
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

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No products found. {products.length > 0 ? 'Try adjusting your filters.' : ''}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={apiService.products.getImageUrl(product.images[0])}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteLoading === product._id}
                        >
                          {deleteLoading === product._id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </span>
                          ) : (
                            "Delete"
                          )}
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  ></textarea>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full border ${formErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.stock}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                    className={`w-full border ${formErrors.images ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload up to 5 images. First image will be the main product image.
                  </p>
                  {formErrors.images && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.images}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;