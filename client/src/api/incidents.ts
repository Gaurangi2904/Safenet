import axios from "axios";
import { API_URL } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface Incident {
  id: string;
  category: string;
  subCategory: string | null;
  severity: string;
  status: string;
  title: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  occurredAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateIncidentData {
  category: string;
  subCategory?: string;
  severity?: string;
  status?: string;
  title: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  occurredAt?: string;
}

export const createIncident = async (
  data: CreateIncidentData
) => {
  const response = await axios.post(
    `${API_URL}/incidents`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getIncidents = async () => {
  const response = await axios.get(
    `${API_URL}/incidents`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getIncident = async (id: string) => {
  const response = await axios.get(
    `${API_URL}/incidents/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const updateIncident = async (
  id: string,
  data: Partial<CreateIncidentData>
) => {
  const response = await axios.put(
    `${API_URL}/incidents/${id}`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteIncident = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/incidents/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};