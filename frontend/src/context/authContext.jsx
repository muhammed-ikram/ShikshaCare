import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const checkUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true
      });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await axios.post(`${API_URL}/auth/login`, { email, password }, {
      withCredentials: true
    });
    await checkUser();
  };

  const register = async (username, email, password) => {
    await axios.post(`${API_URL}/auth/register`, { username, email, password }, {
      headers: { "Content-Type": "application/json" }
    });
    await checkUser(); // Update user state immediately after registration
  };

  const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true
    });
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
