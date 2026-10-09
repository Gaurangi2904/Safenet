import axios from "axios";
import { API_URL } from "./config";

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
  isPrimary: boolean;
  createdAt?: string;
}

export interface CreateTrustedContactData {
  name: string;
  phone: string;
  relation?: string;
  isPrimary?: boolean;
}

export interface UpdateTrustedContactData {
  name: string;
  phone: string;
  relation?: string;
  isPrimary: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getTrustedContacts = async () => {
  const response = await axios.get(
    `${API_URL}/trusted-contacts`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const createTrustedContact = async (
  data: CreateTrustedContactData
) => {
  const response = await axios.post(
    `${API_URL}/trusted-contacts`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const updateTrustedContact = async (
  id: string,
  data: UpdateTrustedContactData
) => {
  const response = await axios.put(
    `${API_URL}/trusted-contacts/${id}`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteTrustedContact = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/trusted-contacts/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};