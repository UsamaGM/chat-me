import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import AuthProvider from "@/contexts/AuthProvider";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
