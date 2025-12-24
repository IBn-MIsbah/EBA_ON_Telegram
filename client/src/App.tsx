import "./App.css";
import LoginForm from "./components/form/LoginForm";
import type { LoginInput } from "./schemas/auth-schema";
import { postLogin } from "./services/auth-api";

function App() {
  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      console.log(data);
      const response = await postLogin(data);
      console.log(response);
      alert("Login success");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };
  return (
    <>
      {/* <h1 className="font-extrabold text-2xl">EBA on Telegram</h1> */}
      <div className="flex h-screen w-screen justify-center items-center bg-stone-300">
        <LoginForm onSubmit={handleLoginSubmit} />
      </div>
    </>
  );
}

export default App;
