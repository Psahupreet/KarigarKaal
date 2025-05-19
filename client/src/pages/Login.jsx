import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://82.29.165.206:7001/api/auth/login", form);
      const { token, user } = res.data;
      // console.log(token,res)

      localStorage.setItem("token", token);
      // console.log(token)
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg mt-10 rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        
      </form>
    </div>
  );
}
