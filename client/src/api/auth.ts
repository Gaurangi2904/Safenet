import axios from "axios";
import { API_URL } from "./config";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("safenet_token");

  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};