import axios from "axios";

const API = axios.create({
  // baseURL: "http://192.168.23.67:5000/api",
  baseURL: "http://localhost:5000/api",
});

export default API;
