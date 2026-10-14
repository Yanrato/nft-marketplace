import { createContext } from "react";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
