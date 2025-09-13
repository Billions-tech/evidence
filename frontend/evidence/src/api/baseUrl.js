// src/api/baseUrl.js
// Centralized base URL for API endpoints
// Change this value for different environments (local, staging, production)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
