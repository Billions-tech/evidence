import axios from "axios";
import { BASE_URL } from "./baseUrl";
const USER_URL = `${BASE_URL}/user`;

export const getProfile = async (token) => {
  const res = await axios.get(`${USER_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (profile, token) => {
  const res = await axios.put(`${USER_URL}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const changePassword = async (data, token) => {
  const res = await axios.put(`${USER_URL}/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSubscription = async (token) => {
  const res = await axios.get(`${USER_URL}/subscription`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const subscribe = async (data, token) => {
  const res = await axios.post(`${USER_URL}/subscribe`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteAccount = async (token) => {
  const res = await axios.delete(`${USER_URL}/delete`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
