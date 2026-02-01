import axios from "axios";

const api = axios.create({
  baseURL: "https://shikshacare-5ke4.onrender.com",
  withCredentials: true
});

export default api;
