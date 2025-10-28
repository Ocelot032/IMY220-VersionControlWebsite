import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.warn("Invalid user data in localStorage. Clearing it.", err);
      localStorage.removeItem("user");
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};