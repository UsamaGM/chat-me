import { createContext } from "react";
import type { UserType } from "./AuthProvider";

type ResponseType = {
  success: boolean;
  message: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserType | null;
  register: (
    name: string,
    email: string,
    password: string,
    pic?: string
  ) => Promise<ResponseType>;
  login: (email: string, password: string) => Promise<ResponseType>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
