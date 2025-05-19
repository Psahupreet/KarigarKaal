import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiX, FiCheck, FiClock, FiMapPin, FiHome, FiCalendar } from "react-icons/fi";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed with checkout.");
      navigate("/login");
      return;
    }
    setShowConfirmation(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!houseNumber.trim()) newErrors.houseNumber = "Flat/House No. is required";
    if (!street.trim()) newErrors.street = "Street/Colony is required";
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedTime) newErrors.time = "Please select a time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNextThreeDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 1; i <= 3; i++) {
      const future = new Date(today);
      future.setDate(today.getDate() + i);
      dates.push(future.toISOString().split("T")[0]);
    }
    return dates;
  };

  const timeSlots = [
    "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
    "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
    "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
  ];

  const placeOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    const fullAddress = `${houseNumber}, ${street}${landmark ? `, Landmark: ${landmark}` : ""} (${addressType})`;
    const timeSlot = `${selectedDate} at ${selectedTime}`;

    try {
      await axios.post(
        "http://localhost:6000/api/orders/place",
        {
          items: cartItems,
          totalAmount: total,
          address: {
            fullAddress,
            timeSlot,
            houseNumber,
            street,
            landmark,
            addressType,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      clearCart();
      setShowConfirmation(false);
      navigate("/my-orders");
    } catch (err) {
      console.error("❌ Error placing order:", err.response?.data || err.message);
      alert("Something went wrong while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <button 
          onClick={() => navigate('/services')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
        >
          Browse Services
        </button>
      </div>
    );
  }

  const availableDates = getNextThreeDates();

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-3 sm:space-y-4">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <img
              src={`http://localhost:6000/uploads/${item.imageUrl}`}
              alt={item.title}
              className="w-full sm:w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 w-full">
              <h2 className="text-lg sm:text-xl font-semibold">{item.title}</h2>
              <p className="text-green-600 font-bold">₹{item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 self-end sm:self-center"
            >
              <FiTrash2 size={16} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total Items:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-green-700">₹{total}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex-1 flex items-center justify-center gap-2"
          >
            <FiCheck size={18} />
            Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 flex items-center justify-center gap-1"
          >
            <FiTrash2 size={16} />
            Clear Cart
          </button>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Your Order</h2>
              <button 
                onClick={() => setShowConfirmation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Address Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiHome size={16} />
                  Flat / House No.<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiMapPin size={16} />
                  Street / Colony<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiMapPin size={16} />
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiHome size={16} />
                  Address Type
                </label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiCalendar size={16} />
                  Select Date<span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-1">
                  <FiClock size={16} />
                  Select Time Slot<span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-1"
                onClick={() => setShowConfirmation(false)}
              >
                <FiX size={16} />
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1"
                onClick={placeOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing...
                  </>
                ) : (
                  <>
                    <FiCheck size={16} />
                    Confirm Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}