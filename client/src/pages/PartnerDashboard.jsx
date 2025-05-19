import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";

export default function PartnerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    earnings: 0,
    completedOrders: 0,
    incompleteOrders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("partnerToken");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/partners/dashboard-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/partners/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const chartData = [
    { name: "Completed", value: stats.completedOrders, color: "#10B981" },
    { name: "Incomplete", value: stats.incompleteOrders, color: "#EF4444" },
  ];

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      color: "bg-blue-500",
      onClick: () => navigate("/partner-orders"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: "Earnings",
      value: `₹${stats.earnings.toLocaleString()}`,
      color: "bg-green-500",
      onClick: () => navigate("/partner-earnings"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      color: "bg-purple-500",
      onClick: () => navigate("/partner-orders?filter=completed"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: "Incomplete Orders",
      value: stats.incompleteOrders,
      color: "bg-red-500",
      onClick: () => navigate("/partner-orders?filter=incomplete"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className={`cursor-pointer ${card.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-3xl mt-2 font-bold">{card.value}</p>
                </div>
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 text-sm font-medium opacity-80">
                Click to view details →
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Order Statistics</h3>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm">Incomplete</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assigned Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">My Assigned Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-600">No assigned orders yet.</p>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-semibold mb-1">Order ID: {order._id}</h4>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Address:</strong> {order.address.flat}, {order.address.street}</p>
                  <p><strong>Time Slot:</strong> {order.timeSlot}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
