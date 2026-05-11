import AuthTabs from "@/components/AuthTabs/AuthTabs";
import Main from "@/components/Main/Main";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { doctor } = useAuth();

  if (doctor) {
    return <Main />;
  }

  return <AuthTabs />;
}