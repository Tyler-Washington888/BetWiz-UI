import axios from "axios";

const isProduction = false;
const baseUrl = isProduction
  ? "https://betwiz-api.herokuapp.com/"
  : "http://localhost:5000";

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
