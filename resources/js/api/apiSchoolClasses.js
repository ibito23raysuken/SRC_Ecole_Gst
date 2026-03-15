import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

/**
 * ➕ CREATE CLASS
 */
export async function createSchoolClassApi(data, token) {
  const response = await api.post("/school-classes", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

/**
 * 📋 GET ALL CLASSES
 */
export async function getAllSchoolClassesApi(token) {
  const response = await api.get("/school-classes", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return Array.isArray(response.data)
    ? response.data
    : response.data.data || [];
}

/**
 * 🔍 GET CLASS BY ID
 */
export async function getSchoolClassByIdApi(id, token) {
  const response = await api.get(`/school-classes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

/**
 * ✏️ UPDATE CLASS
 */
export async function updateSchoolClassApi(id, data, token) {
  const response = await api.put(`/school-classes/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

/**
 * ❌ DELETE CLASS
 */
export async function deleteSchoolClassApi(id, token) {
  await api.delete(`/school-classes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
