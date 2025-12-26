import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { AuthProvider } from "./context/auth-context";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
