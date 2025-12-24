import axios from "axios";

const isProduction = false;
const baseUrl = isProduction
  ? "https:
  : "http:

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
