import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  incidentId: string | null;
  userId: string;
  incident?: {
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
  } | null;
}

export interface CreateJournalEntryData {
  title: string;
  content: string;
  incidentId?: string | null;
}

export interface UpdateJournalEntryData {
  title: string;
  content: string;
  incidentId?: string | null;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getJournalEntries = async () => {
  const response = await axios.get(
    `${API_URL}/journal`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getJournalEntry = async (id: string) => {
  const response = await axios.get(
    `${API_URL}/journal/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const createJournalEntry = async (
  data: CreateJournalEntryData
) => {
  const response = await axios.post(
    `${API_URL}/journal`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const updateJournalEntry = async (
  id: string,
  data: UpdateJournalEntryData
) => {
  const response = await axios.put(
    `${API_URL}/journal/${id}`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteJournalEntry = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/journal/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};