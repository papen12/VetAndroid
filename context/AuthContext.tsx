import React, { createContext, useContext, useState } from "react";
import { Doctor } from "../models/Veterinaria";

interface AuthContextType {
  doctor: Doctor | null;
  setDoctor: (doctor: Doctor | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  doctor: null,
  setDoctor: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const logout = () => setDoctor(null);

  return (
    <AuthContext.Provider value={{ doctor, setDoctor, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}