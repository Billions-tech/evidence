import axios from "axios";

const BASE_URL = "http://localhost:5001/api/inventory";

export const getInventory = async (token) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createInventory = async (item, token) => {
  const res = await axios.post(BASE_URL, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateInventory = async (id, item, token) => {
  const res = await axios.put(`${BASE_URL}/${id}`, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteInventory = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
