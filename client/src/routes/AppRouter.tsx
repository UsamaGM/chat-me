import { Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader";
import LoginPage from "../pages/Auth/LoginPage";
import Homepage from "../pages/Homepage";
import ChatPage from "../pages/ChatPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import { useAuth } from "@/hooks/useAuth";
import ChatProvider from "@/contexts/ChatProvider";

function SuspenseWrapper({ children }: { children?: ReactNode }) {
  return <Suspense fallback={<Loader size="large" />}>{children}</Suspense>;
}

function AuthWrapper({ children }: { children?: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Loader size="large" />;
  }

  return isAuthenticated ? <>{children}</> : <AuthRoutes />;
}

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function AppRouter() {
  return (
    <SuspenseWrapper>
      <AuthWrapper>
        <ChatProvider>
          <Routes>
            <Route path="/home" element={<Homepage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </ChatProvider>
      </AuthWrapper>
    </SuspenseWrapper>
  );
}

export default AppRouter;
