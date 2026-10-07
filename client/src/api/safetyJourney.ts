import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface SafetyJourney {
  id: string;
  destination: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  userId: string;
}

export interface CreateSafetyJourneyData {
  destination: string;
}

export const createSafetyJourney = async (
  data: CreateSafetyJourneyData
) => {
  const response = await axios.post(
    `${API_URL}/safety-journeys`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getSafetyJourneys = async () => {
  const response = await axios.get(
    `${API_URL}/safety-journeys`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const endSafetyJourney = async (
  id: string
) => {
  const response = await axios.put(
    `${API_URL}/safety-journeys/${id}/end`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};