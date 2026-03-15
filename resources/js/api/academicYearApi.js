import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json"
  }
});

/**
 * 📋 GET ALL ACADEMIC YEARS
 */
export async function getAcademicYearsApi(token) {
  const response = await api.get("/settings", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data || [];
}
