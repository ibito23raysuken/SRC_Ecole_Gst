import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json"
  }
});

/**
 * 📋 GET SETTINGS (alias propre)
 */
export async function getSettingsApi(token) {
  try {
    const response = await api.get("/settings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data || null;

  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 204) {
      return null;
    }
    console.error("Erreur getSettingsApi:", error);
    return null;
  }
}

/**
 * 📋 GET ACADEMIC YEAR (compatibilité ancien code)
 */
export async function getAcademicYearsApi(token) {
  return await getSettingsApi(token);
}

/**
 * 💾 SAVE SETTINGS
 */
export async function saveSettingsApi(body, token) {
  try {
    const response = await api.post("/settings", body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data || null;

  } catch (error) {
    console.error("Erreur saveSettingsApi:", error);
    throw error;
  }
}
