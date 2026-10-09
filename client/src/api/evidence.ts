import axios from "axios";
import { API_URL } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("safenet_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface EvidenceRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number | null;
  storagePath: string | null;
  fileHash: string | null;
  description: string | null;
  incidentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvidenceData {
  fileName: string;
  fileType: string;
  fileSize?: number;
  storagePath?: string;
  fileHash?: string;
  description?: string;
  incidentId?: string;
}

export const getEvidenceRecords = async () => {
  const response = await axios.get(
    `${API_URL}/evidence`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getEvidenceRecord = async (
  id: string
) => {
  const response = await axios.get(
    `${API_URL}/evidence/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const createEvidenceRecord = async (
  data: CreateEvidenceData
) => {
  const response = await axios.post(
    `${API_URL}/evidence`,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// UPLOAD ACTUAL EVIDENCE FILE
export const uploadEvidenceFile = async (
  file: File,
  description?: string,
  incidentId?: string
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (description?.trim()) {
    formData.append(
      "description",
      description.trim()
    );
  }

  if (incidentId) {
    formData.append(
      "incidentId",
      incidentId
    );
  }

  const response = await axios.post(
    `${API_URL}/evidence/upload`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteEvidenceRecord = async (
  id: string
) => {
  const response = await axios.delete(
    `${API_URL}/evidence/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Returns the secure backend endpoint.
// Authorization must be supplied when requesting
// the actual file.
export const getEvidenceFileUrl = (
  id: string
) => {
  return `${API_URL}/evidence/file/${id}`;
};

export const verifyEvidenceIntegrity = async (
  id: string
) => {
  const response = await axios.get(
    `${API_URL}/evidence/verify/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};