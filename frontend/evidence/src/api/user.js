import axios from "axios";

const BASE_URL = "http://localhost:5001/api/user";

export const getProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (profile, token) => {
  const res = await axios.put(`${BASE_URL}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const changePassword = async (data, token) => {
  const res = await axios.put(`${BASE_URL}/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSubscription = async (token) => {
  const res = await axios.get(`${BASE_URL}/subscription`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const subscribe = async (data, token) => {
  const res = await axios.post(`${BASE_URL}/subscribe`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteAccount = async (token) => {
  const res = await axios.delete(`${BASE_URL}/delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
