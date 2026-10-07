import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface CreateSosData {
  latitude?: number;
  longitude?: number;
  journeyId?: string;
}

export interface SosEvent {
  id: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  journeyId: string | null;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export const triggerSos = async (data: CreateSosData = {}) => {
  const response = await axios.post(
    `${API_URL}/sos`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getSosEvents = async () => {
  const response = await axios.get(
    `${API_URL}/sos`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const resolveSos = async (id: string) => {
  const response = await axios.put(
    `${API_URL}/sos/${id}/resolve`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};