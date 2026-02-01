import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, token) => {
    setUser(userData);
    // Token is handled by api instance (cookies/headers)
    // We don't necessarily need to checkUser again immediately if we just logged in successfully
    // but we can if we want to be 100% sure the cookie is valid.
    // However, to prevent flickering/redirect loop, we trust the userData returned from login.
  };

  const register = async (username, email, password) => {
    await api.post("/api/auth/register", { username, email, password });
    await checkUser();
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    checkUser();
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
