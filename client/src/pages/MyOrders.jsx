import { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://82.29.165.206:8080/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://82.29.165.206:8080/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders(); // Refresh after cancel
    } catch (err) {
      console.error("❌ Failed to cancel order:", err);
      alert("Failed to cancel order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        My Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded shadow bg-white animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 sm:p-5 rounded-lg shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-indigo-700 truncate">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-sm sm:text-base">
                    <span className="font-medium">Total:</span> ₹{order.totalAmount}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end">
                  <span
                    className={`text-sm sm:text-base font-semibold ${
                      order.status === "Cancelled" ? "text-red-500" : 
                      order.status === "Completed" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Structured Address */}
              <div className="mt-3 space-y-1 text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium mb-1 text-gray-900">Delivery Address:</h3>
                <p><span className="font-medium">🏠 House No:</span> {order.address?.houseNumber}</p>
                <p><span className="font-medium">🛣️ Street/Colony:</span> {order.address?.street}</p>
                {order.address?.landmark && (
                  <p><span className="font-medium">📍 Landmark:</span> {order.address.landmark}</p>
                )}
                <p><span className="font-medium">🏷️ Address Type:</span> {order.address?.addressType}</p>
                <p className="break-words"><span className="font-medium">📬 Full Address:</span> {order.address?.fullAddress}</p>
                <p><span className="font-medium">🕑 Time Slot:</span> {order.address?.timeSlot}</p>
              </div>

              {/* Items List */}
              <div className="mt-3 space-y-2">
                <h3 className="font-medium text-sm sm:text-base text-gray-900">Order Items:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 border p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={`http://82.29.165.206:8080/uploads/${item.imageUrl}`}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100?text=Product';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{item.title}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs sm:text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                          <p className="text-xs sm:text-sm font-medium">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel Button */}
              {order.status !== "Cancelled" && order.status !== "Completed" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}