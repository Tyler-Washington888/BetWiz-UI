import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserAccount } from "../services/userApi";
import { useAuth } from "./AuthContext";

export interface UserAccount {
  creditBalance: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  linkedToBet360: boolean;
}

interface UserContextType {
  userAccount: UserAccount | null;
  loading: boolean;
  error: string | null;
  updateBalance: (creditBalance: number) => void;
  refreshAccount: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth(); 

  
  const fetchUserAccount = async (): Promise<UserAccount> => {
    return await getUserAccount();
  };

  const refreshAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const account = await fetchUserAccount();
      setUserAccount(account);
    } catch (err) {
      setError("Failed to fetch account data");
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = (creditBalance: number) => {
    if (userAccount) {
      setUserAccount({
        ...userAccount,
        creditBalance,
      });
    }
  };

  
  useEffect(() => {
    if (currentUser) {
      refreshAccount();
    } else {
      
      setUserAccount(null);
      setError(null);
    }
  }, [currentUser]);

  const value: UserContextType = {
    userAccount,
    loading,
    error,
    updateBalance,
    refreshAccount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
