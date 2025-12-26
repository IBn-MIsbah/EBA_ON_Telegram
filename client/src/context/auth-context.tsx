/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../page/Dashboard";
import type { LoginInput } from "../schemas/auth-schema";
import { getMe, postLogin, postLogout } from "../services/auth-api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userData = await getMe();
      setUser(userData?.data);
      // console.group("Get me");
      // console.log("isLoading: ", isLoading);
      // console.log("userData: ", userData);
      // console.groupEnd();
    } catch (error) {
      setUser(null);
      console.error("Auth check failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      await postLogin(data);
      await checkAuth();
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await postLogout();
    } catch (error) {
      console.error("Logout Error: ", error);
    } finally {
      setUser(null);
      setIsLoading(false);

      window.dispatchEvent(new Event("authLogout"));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleGlobalLogout = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("authLogout", handleGlobalLogout);

    return () => {
      window.removeEventListener("authLogout", handleGlobalLogout);
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
