// src/apiClient.js
import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
          const token = localStorage.getItem("vpf_admin_token");
        
          const url = config.url || "";
        
          const isPublic =
            url.includes("/properties/list.php") ||
            url.includes("/properties/get.php");
        
          if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        
          return config;
        });
        

export default api;
