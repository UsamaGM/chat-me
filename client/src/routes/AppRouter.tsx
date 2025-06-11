import api from "@/config/api";
import Chat from "@/pages/Homepage/Right/Chat";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import errorHandler from "@/config/errorHandler";
import Homepage from "../pages/Homepage";
import Loader from "../components/Loader";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";

function AppRouter() {
  const { loading, isAuthenticated } = useAuth();

  const fetchChats = useCallback(async function () {
    try {
      console.log("Fetching chats...");

      return await api.get("/chat");
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }, []);

  const authRouter = createBrowserRouter([
    { path: "/", element: <Navigate to="/auth/login" /> },
    {
      path: "/auth",
      children: [
        { path: "/auth/login", element: <LoginPage /> },
        { path: "/auth/register", element: <RegisterPage /> },
        { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
        { path: "/auth/reset-password/:token", element: <ResetPasswordPage /> },
      ],
    },
  ]);

  const homeRouter = createBrowserRouter([
    { path: "/", element: <Navigate to="/home" /> },
    {
      path: "/home",
      element: <Homepage />,
      loader: async () => await fetchChats(),
      hydrateFallbackElement: <Loader size="large" />,
      children: [
        {
          path: "/home/",
          element: (
            <div className="flex flex-2/3 items-center justify-center">
              <p>Select a Chat to start conversation!</p>
            </div>
          ),
        },
        {
          path: "/home/chat/:id",
          element: <Chat />,
          loader: async ({ params }) => {
            return await api.get(`/chat/${params.id}`);
          },
          hydrateFallbackElement: <Loader size="large" />,
        },
      ],
    },
  ]);

  const baseRouter = isAuthenticated ? homeRouter : authRouter;

  if (loading) return null;
  return <RouterProvider router={baseRouter} />;
}

export default AppRouter;
