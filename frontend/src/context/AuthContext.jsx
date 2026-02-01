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

  const login = async (user, token) => {
    setUser(user);
    // Token is handled by api instance (cookies/headers)
    await checkUser();
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
