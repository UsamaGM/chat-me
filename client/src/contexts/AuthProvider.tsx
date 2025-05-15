import { useState } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  async function login(email: string, password: string) {
    //TODO: Implement login logic
    console.log(email, password);
    setIsAuthenticated(true);
  }
  function logout() {
    //TODO: Implement logout logic
    setIsAuthenticated(false);
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
