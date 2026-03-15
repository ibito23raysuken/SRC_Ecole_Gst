import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

/**
 * ➕ CREATE TEACHER
 */
export async function createTeacherApi(formData, token) {
  console.log("API CALL - createTeacherApi", formData);

  const response = await api.post("/teachers", formData, {
    headers: {
      Authorization: `Bearer ${token}`
      // ⚠️ NE PAS mettre Content-Type
      // axios gère automatiquement multipart/form-data
    }
  });

  return response.data;
}


/**
 * ✏️ UPDATE TEACHER
 */
export async function updateTeacherApi(teacherId, data, token) {
  const formData = new FormData();
  formData.append("_method", "PATCH");

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.post(`/teachers/${teacherId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}


/**
 * 🔍 GET TEACHER BY ID
 */
export async function getTeacherApi(id, token) {
  const response = await api.get(`/teachers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}


/**
 * 🔍 GET ALL TEACHERS
 */
export async function getAllTeachersApi(token) {
  const response = await api.get("/teachers", {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}


/**
 * ❌ DELETE TEACHER
 */
export async function deleteTeacherApi(teacherId, token) {
  await api.delete(`/teachers/${teacherId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
