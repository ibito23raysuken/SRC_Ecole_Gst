import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

/**
 * 🔐 Ajouter automatiquement le token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ne pas imposer application/json aux fichiers FormData.
    if (config.data instanceof FormData) {
      config.headers.delete?.("Content-Type");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ⚠️ Déconnexion si le token expire
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
