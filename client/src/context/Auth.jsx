import { useState, useContext, createContext } from "react";
import api from "../api/axios";
import { useEffect } from "react";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [us, sus] = useState(null);
  const [tk, stk] = useState(localStorage.getItem("token"));
  const [ld, sld] = useState(true);

  const refreshSession = async () => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      sus(null);
      stk(null);
      sld(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/session");
      sus(data.user);
    } catch (err) {
      localStorage.removeItem("token");
      sus(null);
      stk(null);
    } finally {
      sld(false);
    }
  };
  useEffect(() => {
    refreshSession();
  }, []);
  const login = async (email, password, role_type) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      role_type,
    });
    localStorage.setItem("token", data.token);
    stk(data.token);
    sus(data.user);
    return data.user;
  };
  const logOut = async () => {
    localStorage.removeItem("token");
    stk(null);
    sus("");
  };

  const value = { us, tk, ld, login, logOut, refreshSession };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UseAuth must be used within AuthProvider");
  return ctx;
}
