import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Loader from "../components/Loader";
import LoginPage from "../pages/Auth/LoginPage";
import Homepage from "../pages/Homepage";
import RegisterPage from "../pages/Auth/RegisterPage";
import { useAuth } from "@/hooks/useAuth";
import ChatProvider from "@/contexts/ChatProvider";
import api from "@/config/api";
import Chat from "@/pages/Homepage/Chat";

function AppRouter() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={isAuthenticated ? "/home" : "/login"} />,
    },
    {
      path: "/home",
      element: (
        <ChatProvider>
          <Homepage />
        </ChatProvider>
      ),
      children: [
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
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default AppRouter;
