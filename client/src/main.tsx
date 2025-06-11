import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./contexts/AuthProvider.tsx";
import ChatProvider from "./contexts/ChatProvider.tsx";
import { ToastContainer } from "react-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
        <ToastContainer position="top-right" />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>
);
