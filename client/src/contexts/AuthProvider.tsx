import api from "@/config/api";
import AuthContext from "./AuthContext";
import errorHandler from "@/config/errorHandler";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toast";
import { type UserType } from "./AuthContext";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken")
  );
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authLoaded = useRef(false);

  useEffect(() => {
    if (authLoaded.current === true) {
      return;
    }
    authLoaded.current = true;

    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Fetching profile");

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api
        .get("/user/profile")
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          if (error.code !== "ERR_NETWORK") {
            localStorage.removeItem("authToken");
            delete api.defaults.headers.common.Authorization;
            setIsAuthenticated(false);
            setUser(null);
            toast.error("Your session has expired. Please log in again.");
          } else {
            toast.error("Failed to connect to server!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      const response = await api.post("/user/login", { email, password });

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setIsAuthenticated(true);
      setUser(response.data.user);

      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    localStorage.removeItem("authToken");
    delete api.defaults.headers.common.Authorization;

    setIsAuthenticated(false);
    setUser(null);
    window.location.href = location.origin;
  }

  async function register(
    name: string,
    email: string,
    password: string,
    pic?: string
  ) {
    try {
      setLoading(true);
      await api.post("/user/register", { name, email, password, pic });
      return { success: true, message: "Successfully Registered the user!" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(data: {
    name: string;
    email: string;
    bio?: string;
    avatar?: File;
  }) {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await api.put("/user/profile", formData);
      setUser(response.data);
      return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
      return { success: false, message: errorHandler(error) };
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authLoaded: authLoaded.current,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
