import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import AuthProvider from "@/contexts/AuthProvider";
import { ToastContainer } from "react-toast";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRouter />
        <ToastContainer position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
