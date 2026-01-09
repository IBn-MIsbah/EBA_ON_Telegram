import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
