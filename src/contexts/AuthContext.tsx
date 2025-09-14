import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  verifyUser,
  removeToken,
  User,
} from "../services/auth";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const userData = await verifyUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Verification failed:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    handleVerify();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser({ email, password });
      setCurrentUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => {
    try {
      const userData = await registerUser({
        firstname,
        lastname,
        email,
        password,
        dateOfBirth,
      });
      setCurrentUser(userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    removeToken();
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
