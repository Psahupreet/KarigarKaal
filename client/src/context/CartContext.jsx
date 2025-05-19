// src/context/CartContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
const TOKEN_KEY = "token"; 
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem(TOKEN_KEY); // ✅ Consistent
    if (!token) {
      console.error("❌ No user token found. Cannot fetch cart.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:6000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    }
  };

  const saveCart = async (items) => {
    const token = localStorage.getItem(TOKEN_KEY); // ✅ Consistent
    if (!token) return;
    try {
      await axios.put(
        "http://localhost:6000/api/cart",
        { items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("❌ Failed to save cart:", err);
    }
  };

  const addToCart = (item) => {
    const exists = cartItems.some((i) => i.id === item.id);
    if (exists) return;
    const updated = [...cartItems, item];
    setCartItems(updated);
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY); // ✅ Consistent
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
