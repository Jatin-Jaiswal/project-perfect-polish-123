import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

// Move admin emails to localStorage for persistence
const getStoredAdminEmails = () => {
  const stored = localStorage.getItem("adminEmails");
  return stored ? JSON.parse(stored) : [
    "admin@test.com", 
    "admin2@test.com", 
    "jatinjaiswal673@gmail.com",
    "jatin5555",
    "goursourabh1354@gmail.com",
    "siyaram1354"
  ];
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getAllAdminEmails: () => string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmails, setAdminEmails] = useState<string[]>(getStoredAdminEmails());

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user with isAdmin based on email
    const isAdmin = adminEmails.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      name: email.split('@')[0],
      isAdmin
    };
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user with isAdmin based on email
    const isAdmin = adminEmails.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      name,
      isAdmin
    };
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const getAllAdminEmails = () => {
    return [...adminEmails];
  };

  const addAdminEmail = (email: string) => {
    const newAdminEmails = [...adminEmails, email.toLowerCase()];
    setAdminEmails(newAdminEmails);
    localStorage.setItem("adminEmails", JSON.stringify(newAdminEmails));
  };

  const removeAdminEmail = (email: string) => {
    const newAdminEmails = adminEmails.filter(e => e.toLowerCase() !== email.toLowerCase());
    setAdminEmails(newAdminEmails);
    localStorage.setItem("adminEmails", JSON.stringify(newAdminEmails));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        signup, 
        logout, 
        getAllAdminEmails,
        addAdminEmail,
        removeAdminEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
