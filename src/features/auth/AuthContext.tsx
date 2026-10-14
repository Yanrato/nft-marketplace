
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthToken,
  getCurrentSession,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveAuthToken,
} from "./api";
import { AuthContext, type AuthUser } from "./auth-context";
import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!token) {
      setUser(null);
      setExpiresAt(null);
      setIsLoading(false);
      return;
    }

    try {
      const session = await getCurrentSession();

      setUser(session.user);
      setExpiresAt(session.expiresAt);
    } catch {
      clearAuthToken();
      setUser(null);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function restore() {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      if (!token) {
        if (active) {
          setUser(null);
          setExpiresAt(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const session = await getCurrentSession();

        if (active) {
          setUser(session.user);
          setExpiresAt(session.expiresAt);
        }
      } catch {
        if (active) {
          clearAuthToken();
          setUser(null);
          setExpiresAt(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restore();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_STORAGE_KEY) {
        setIsLoading(true);
        void restoreSession();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, [restoreSession]);

  useEffect(() => {
    if (!user || expiresAt === null) {
      return;
    }

    const remaining = expiresAt - Date.now();

    const timeoutId = setTimeout(() => {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      clearAuthToken();
      setUser(null);
      setExpiresAt(null);

      if (token) {
        void logoutAccount(token).catch(() => undefined);
      }
    }, Math.max(remaining, 0));

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, expiresAt]);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const session = await registerAccount(username, email, password);

      saveAuthToken(session.token);
      setUser(session.user);
      setExpiresAt(session.expiresAt);
      setIsLoading(false);
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginAccount(email, password);

    saveAuthToken(session.token);
    setUser(session.user);
    setExpiresAt(session.expiresAt);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    clearAuthToken();
    setUser(null);
    setExpiresAt(null);
    setIsLoading(false);

    if (token) {
      void logoutAccount(token).catch(() => undefined);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      register,
      login,
      logout,
    }),
    [user, isLoading, register, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
