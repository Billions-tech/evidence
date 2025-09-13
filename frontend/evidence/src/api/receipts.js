// src/api/receipts.js
import axios from "axios";

const BASE_URL = "http://localhost:5001/api/receipts";

export function createReceipt(data, token) {
  return axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getReceipt(id, token) {
  return axios.get(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteReceipt(id, token) {
  return axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
