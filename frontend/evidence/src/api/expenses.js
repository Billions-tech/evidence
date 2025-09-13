import axios from "axios";
import { BASE_URL } from "./baseUrl";

export const getExpenses = async (token) => {
  const res = await axios.get(`${BASE_URL}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createExpense = async (expense, token) => {
  const res = await axios.post(`${BASE_URL}/expenses`, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateExpense = async (id, expense, token) => {
  const res = await axios.put(`${BASE_URL}/expenses/${id}`, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteExpense = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
