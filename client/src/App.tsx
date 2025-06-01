import AuthProvider from "@/contexts/AuthProvider";
import { ToastContainer } from "react-toast";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

export default App;
