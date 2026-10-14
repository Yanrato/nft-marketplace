
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext, type AuthUser } from "./auth-context";

const USERS_KEY = "kurio_demo_users";
const SESSION_KEY = "kurio_demo_session";
const SESSION_DURATION = 30 * 60 * 1000;

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
}

interface StoredSession {
  userId: string;
  expiresAt: number;
}

function readUsers(): StoredUser[] {
  try {
    const value = localStorage.getItem(USERS_KEY);
    if (!value) return [];

    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is StoredUser =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "username" in item &&
        "email" in item &&
        "passwordSalt" in item &&
        "passwordHash" in item &&
        "createdAt" in item &&
        typeof item.id === "string" &&
        typeof item.username === "string" &&
        typeof item.email === "string" &&
        typeof item.passwordSalt === "string" &&
        typeof item.passwordHash === "string" &&
        typeof item.createdAt === "string"
    );
  } catch {
    return [];
  }
}

function toAuthUser(account: StoredUser): AuthUser {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function readValidSession(): AuthUser | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const session: unknown = JSON.parse(stored);

    if (
      typeof session !== "object" ||
      session === null ||
      !("userId" in session) ||
      !("expiresAt" in session) ||
      typeof session.userId !== "string" ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    const account = readUsers().find(
      (candidate) => candidate.id === session.userId
    );

    if (!account) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return toAuthUser(account);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}

async function hashPassword(
  password: string,
  saltHex: string
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const saltBuffer = new ArrayBuffer(16);
  new Uint8Array(saltBuffer).set(hexToBytes(saltHex));

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return bytesToHex(new Uint8Array(derivedBits));
}

function createSalt(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

function saveSession(account: StoredUser): AuthUser {
  const session: StoredSession = {
    userId: account.id,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return toAuthUser(account);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readValidSession());

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const cleanUsername = username.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (cleanUsername.length < 3) {
        throw new Error(
          "O nome de usuário deve ter pelo menos 3 caracteres."
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error("Informe um e-mail válido.");
      }

      if (password.length < 8) {
        throw new Error("A senha deve ter pelo menos 8 caracteres.");
      }

      const users = readUsers();

      if (
        users.some(
          (account) =>
            account.email.toLowerCase() === cleanEmail ||
            account.username.toLowerCase() === cleanUsername.toLowerCase()
        )
      ) {
        throw new Error(
          "Este e-mail ou nome de usuário já está cadastrado."
        );
      }

      const passwordSalt = createSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        username: cleanUsername,
        email: cleanEmail,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      try {
        const latestUsers = readUsers();

        if (
          latestUsers.some(
            (account) =>
              account.email.toLowerCase() === cleanEmail ||
              account.username.toLowerCase() === cleanUsername.toLowerCase()
          )
        ) {
          throw new Error(
            "Este e-mail ou nome de usuário já está cadastrado."
          );
        }

        localStorage.setItem(
          USERS_KEY,
          JSON.stringify([...latestUsers, newUser])
        );

        setUser(saveSession(newUser));
      } catch (error) {
        if (
          error instanceof Error &&
          error.message ===
            "Este e-mail ou nome de usuário já está cadastrado."
        ) {
          throw error;
        }

        throw new Error(
          "Não foi possível salvar a conta neste navegador.",
          { cause: error }
        );
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    const account = readUsers().find(
      (candidate) => candidate.email.toLowerCase() === cleanEmail
    );

    if (!account) {
      throw new Error("E-mail ou senha incorretos.");
    }

    const passwordHash = await hashPassword(
      password,
      account.passwordSalt
    );

    if (passwordHash !== account.passwordHash) {
      throw new Error("E-mail ou senha incorretos.");
    }

    try {
      setUser(saveSession(account));
    } catch (error) {
      throw new Error("Não foi possível iniciar a sessão.", {
        cause: error,
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const checkSession = () => {
      const currentUser = readValidSession();

      if (!currentUser || currentUser.id !== user.id) {
        logout();
        return;
      }

      try {
        const stored = localStorage.getItem(SESSION_KEY);

        if (!stored) {
          logout();
          return;
        }

        const session = JSON.parse(stored) as StoredSession;
        const remaining = session.expiresAt - Date.now();

        if (remaining <= 0) {
          logout();
          return;
        }

        timeoutId = setTimeout(checkSession, remaining);
      } catch {
        logout();
      }
    };

    checkSession();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY || event.key === USERS_KEY) {
        const currentUser = readValidSession();

        if (!currentUser || currentUser.id !== user.id) {
          logout();
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorage);
    };
  }, [user, logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      register,
      login,
      logout,
    }),
    [user, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
