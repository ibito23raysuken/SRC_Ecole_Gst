//path: resources/js/api/apistudents.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { Accept: "application/json" }
});

/**
 * ➕ CREATE STUDENT
 */
export async function createStudentApi(formData, token) {
console.log("API CALL - createStudentApi", formData);
  const response = await api.post("/students", formData, {
    headers: {
      Authorization: `Bearer ${token}`
      // ⚠️ NE PAS mettre Content-Type
      // axios le gère automatiquement pour multipart/form-data
    }
  });

  return response.data;
}


/**
 * ✏️ UPDATE STUDENT
 */
export async function updateStudentApi(studentId, data, token) {
  const formData = new FormData();

  // ⚡ Laravel PATCH via POST
  formData.append("_method", "PATCH");

  // Parcours de chaque champ
  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value instanceof File) {
      // Image ou fichier
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      // ⚡ Si c'est un objet ou tableau (parents, payment, dossier), stringify pour Laravel
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        // Valeurs simples (string, number, boolean)
        formData.append(key, value);
      }
    }
  });

  // ⚠️ Important : ne pas définir Content-Type → axios gère multipart/form-data
  const response = await api.post(`/students/${studentId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}


/**
 * 🔍 GET STUDENT BY ID
 */
export async function getStudentsApi(id, token) {
  const response = await api.get(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}


/**
 * 🔍 GET ALL STUDENTS
 */
export async function getAllStudentsApi(token) {
  const response = await api.get('/students', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}


/**
 * ❌ DELETE STUDENT
 */
export async function deleteStudentApi(studentId, token) {
  await api.delete(`/students/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
