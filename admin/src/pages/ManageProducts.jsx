import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  return (
    <div className="lg:ml-64 px-4 sm:px-6 py-6 sm:py-8 mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Products</h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        <button className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add New Product
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm sm:shadow-md overflow-hidden border border-gray-100 animate-pulse">
              <div className="bg-gray-200 h-40 sm:h-48 w-full"></div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded mt-3 sm:mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden border border-gray-100 hover:shadow-md sm:hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                  }}
                />
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>
              <div className="p-3 sm:p-4 md:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 text-center inline-flex items-center transition-colors duration-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Get started by adding your first product
          </p>
          <div className="mt-4 sm:mt-6">
            <button className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}