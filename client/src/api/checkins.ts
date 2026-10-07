import axios from "axios";



const API_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface CreateCheckInData {
  location?: string;
  message?: string;
  checkInAt: string;
  expiresAt: string;
}

export interface CheckInRecord {
  id: string;
  status: string;
  message: string | null;
  location: string | null;
  checkInAt: string;
  expiresAt: string;
  createdAt: string;
  userId: string;
}

export const createCheckIn = async (data: CreateCheckInData) => {
  const response = await axios.post(
    `${API_URL}/checkins`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getCheckIns = async () => {
  const response = await axios.get(
    `${API_URL}/checkins`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};