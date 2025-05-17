import { useState } from "react";
import AuthContext from "./AuthContext";
import api from "@/config/api";
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  async function login(email: string, password: string) {
    try {
      const response = await api.post("/api/user/login", {
        email,
        password,
      });
      localStorage.setItem("authToken", response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(`Login failed ${error}`);
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
