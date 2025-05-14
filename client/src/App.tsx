import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { createRoutesFromElements, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import Loader from "./components/Loader";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Homepage />}
          loader={() => new Promise((resolve) => setTimeout(resolve, 5000))}
          hydrateFallbackElement={<Loader />}
        />
        <Route
          path="/chats"
          element={<ChatPage />}
          loader={() => new Promise((resolve) => setTimeout(resolve, 2000))}
          hydrateFallbackElement={<Loader />}
        />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
