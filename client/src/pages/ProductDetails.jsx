import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cartItems } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  const [showAddedCard, setShowAddedCard] = useState(false);
  const [showAlreadyInCart, setShowAlreadyInCart] = useState(false);
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    axios
      .get(`http://82.29.165.206:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product", err);
        setIsLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some((item) => item.id === product._id);
    if (alreadyInCart) {
      setShowAlreadyInCart(true);
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      imageUrl: product.images[0],
    });

    setShowAddedCard(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 animate-pulse">
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-200 h-64 sm:h-80 md:h-96 rounded-lg sm:rounded-xl"></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-200 h-24 sm:h-32 rounded-lg"></div>
              <div className="bg-gray-200 h-24 sm:h-32 rounded-lg"></div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-200 h-6 sm:h-8 rounded w-3/4"></div>
            <div className="bg-gray-200 h-5 sm:h-6 rounded w-1/4"></div>
            <div className="bg-gray-200 h-5 sm:h-6 rounded w-1/2"></div>
            <div className="bg-gray-200 h-24 sm:h-32 rounded"></div>
            <div className="bg-gray-200 h-10 sm:h-12 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h2 className="text-xl sm:text-2xl font-medium text-gray-700">Product not found</h2>
      <button 
        onClick={() => navigate('/products')}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Browse Services
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      {/* Product Content */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
            <img
              src={`http://localhost:5000/uploads/${product.images[mainImage]}`}
              alt={product.name}
              className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer"
              onClick={() => window.open(`http://localhost:5000/uploads/${product.images[mainImage]}`, '_blank')}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {product.images.map((img, index) => (
              <div 
                key={index} 
                className={`rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all ${mainImage === index ? 'ring-2 ring-indigo-500' : 'hover:shadow-md'}`}
                onClick={() => setMainImage(index)}
              >
                <img
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-20 sm:h-24 md:h-28 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm sm:text-base text-gray-700 font-medium">{product.rating}</span>
              </div>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-green-600">₹{product.price}</p>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {product.description}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-300 text-sm sm:text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      {product.review && (
        <div className="mt-10 sm:mt-12 md:mt-16 border-t border-gray-200 pt-6 sm:pt-8 md:pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Reviews</h2>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
            <p className="text-gray-700 italic text-sm sm:text-base">"{product.review}"</p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showAddedCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xl max-w-xs sm:max-w-sm w-full mx-4">
            <div className="flex items-center justify-center text-green-500 mb-3 sm:mb-4">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-3 sm:mb-4">Service Added to Cart</h2>
            <button
              onClick={() => setShowAddedCard(false)}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Already in Cart Notification */}
      {showAlreadyInCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-xl max-w-xs sm:max-w-sm w-full mx-4">
            <div className="flex items-center justify-center text-blue-500 mb-3 sm:mb-4">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-3 sm:mb-4">Service Already in Cart</h2>
            <button
              onClick={() => setShowAlreadyInCart(false)}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}