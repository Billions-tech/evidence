import axios from "axios";
import { BASE_URL } from "./baseUrl";

export const getNotes = async (token) => {
  const res = await axios.get(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createNote = async (note, token) => {
  const res = await axios.post(`${BASE_URL}/notes`, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateNote = async (id, note, token) => {
  const res = await axios.put(`${BASE_URL}/notes/${id}`, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteNote = async (id, token) => {
  const res = await axios.delete(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
