// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://82.29.165.206:7001/api", // your backend URL
  withCredentials: true,
});


export default api;
