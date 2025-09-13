// src/api/auth.js
import axios from "axios";
import { BASE_URL } from "./baseUrl";

export function register(data) {
  return axios.post(`${BASE_URL}/auth/register`, data);
}

export function login(data) {
  return axios.post(`${BASE_URL}/auth/login`, data);
}

export function getMe(token) {
  return axios.get(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function getProfile(token) {
  return axios.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
