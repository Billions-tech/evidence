// src/api/auth.js
import axios from "axios";

const BASE_URL = "http://localhost:5001/api/auth";

export function register(data) {
  return axios.post(`${BASE_URL}/register`, data);
}

export function login(data) {
  return axios.post(`${BASE_URL}/login`, data);
}

export function getMe(token) {
  return axios.get(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
