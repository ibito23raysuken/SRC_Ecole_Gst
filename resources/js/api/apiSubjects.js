import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

/**
 * ➕ CREATE SUBJECT
 */
export async function createSubjectApi(data, token) {
  const response = await api.post("/subjects", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

/**
 * 📋 GET ALL SUBJECTS
 */
export async function getSubjectsApi(token) {
  const response = await api.get("/subjects", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return Array.isArray(response.data)
    ? response.data
    : response.data.data || [];
}

export async function deleteSubjectApi(id, token) {
  const response = await api.delete(`/subjects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}
