import axios from "axios";

import { BASE_URL } from "./baseUrl";
const INVENTORY_URL = `${BASE_URL}/inventory`;

export const getInventory = async (token) => {
  const res = await axios.get(INVENTORY_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createInventory = async (item, token) => {
  const res = await axios.post(INVENTORY_URL, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateInventory = async (id, item, token) => {
  const res = await axios.put(`${INVENTORY_URL}/${id}`, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteInventory = async (id, token) => {
  const res = await axios.delete(`${INVENTORY_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
