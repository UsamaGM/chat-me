import { createContext } from "react";

type ResponseType = {
  success: boolean;
  message: string;
};

type AuthContextType = {
  authLoaded: boolean;
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
  updateProfile: (data: {
    name: string;
    email: string;
    bio?: string;
    avatar?: File;
  }) => Promise<ResponseType>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export interface UserType {
  _id: string;
  name: string;
  email: string;
  pic: string;
}

export default AuthContext;
