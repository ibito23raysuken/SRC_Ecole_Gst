import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // utile pour spinner ou loader

  // Met à jour le token dans le localStorage automatiquement
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setUser({}); // reset user si pas de token
    }
  }, [token]);

  // Récupère l'utilisateur depuis l'API
  async function fetchUser() {
    if (!token) return setLoading(false);
    try {
      const response = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Token invalide ou expiré");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error(err);
      setToken(""); // supprime le token invalide
      setUser({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
}
