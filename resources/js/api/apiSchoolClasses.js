import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json"
  }
});

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`
});

/**
 * ➕ CREATE CLASS
 */
export async function createSchoolClassApi(data, token) {
  const response = await api.post("/school-classes", data, {
    headers: authHeader(token)
  });

  return response.data;
}

/**
 * 📋 GET ALL CLASSES
 */
export async function getAllSchoolClassesApi(token) {
  const response = await api.get("/school-classes", {
    headers: authHeader(token)
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

/**
 * 🔍 GET CLASS BY ID
 */
export async function getSchoolClassByIdApi(id, token) {
  const response = await api.get(`/school-classes/${id}`, {
    headers: authHeader(token)
  });

  return response.data;
}

/**
 * ✏️ UPDATE CLASS
 */
export async function updateSchoolClassApi(id, data, token) {
  const response = await api.put(`/school-classes/${id}`, data, {
    headers: authHeader(token)
  });

  return response.data;
}

/**
 * ❌ DELETE CLASS
 */
export async function deleteSchoolClassApi(id, token) {
  const response = await api.delete(`/school-classes/${id}`, {
    headers: authHeader(token)
  });

  return response.data;
}

/**
 * 🎯 FREE CLASSES BY LEVEL
 */
export async function getFreeClassByLevelApi(level, token) {
  if (!level) return [];

  const response = await api.get("/school-classes/free", {
    params: { level },
    headers: authHeader(token)
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.classes)) return data.classes;

  return [];
}
