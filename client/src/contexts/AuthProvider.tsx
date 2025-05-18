import api from "@/config/api";
import AuthContext from "./AuthContext";
import errorHandler from "@/config/errorHandler";
import { useEffect, useState } from "react";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  pic: string;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken")
  );
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUserData();
    }
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      const response = await api.get("/api/user/profile");
      setUser(response.data);
      return { success: true, message: "Fetched data successfully" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    pic?: string
  ) {
    try {
      setLoading(true);
      await api.post("/api/user/register", {
        name,
        email,
        password,
        pic,
      });

      return { success: true, message: "Successfully Registered the user!" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      const response = await api.post("/api/user/login", {
        email,
        password,
      });

      localStorage.setItem("authToken", response.data.token);
      setIsAuthenticated(true);
      setUser(response.data.user);

      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
