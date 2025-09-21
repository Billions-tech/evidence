// Verify a receipt by uploading an image/PDF
export function verifyUploadReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${RECEIPTS_URL}/verify-upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
// Get dashboard summary for a given month/year
export function getDashboardSummary({ month, year, token }) {
  return axios.get(
    `${RECEIPTS_URL}/dashboard/summary?month=${month}&year=${year}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

// Get all receipts for the user
export function getAllReceipts(token) {
  return axios.get(RECEIPTS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Verify a receipt by QR data
export function verifyReceipt(qrData) {
  return axios.post(`${RECEIPTS_URL}/verify`, { qrData });
}
// src/api/receipts.js
import axios from "axios";
import { BASE_URL } from "./baseUrl";

const RECEIPTS_URL = `${BASE_URL}/receipts`;

export function createReceipt(data, token) {
  return axios.post(RECEIPTS_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getReceipt(id, token) {
  return axios.get(`${RECEIPTS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteReceipt(id, token) {
  return axios.delete(`${RECEIPTS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
