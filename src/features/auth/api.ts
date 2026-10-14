import { isAxiosError } from "axios";
import { api, AUTH_TOKEN_STORAGE_KEY } from "@/lib/api";
import type { AuthUser } from "./auth-context";

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

export interface CurrentSession {
  user: AuthUser;
  expiresAt: number;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

interface ApiErrorResponse {
  code?: string;
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (!error.response) {
      return "Não foi possível conectar à API simulada. Verifique se o MSW está habilitado.";
    }
  }

  return fallback;
}

export async function registerAccount(
  username: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  try {
    const response = await api.post<AuthResponse>("/auth/register", {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Não foi possível criar a conta."),
      { cause: error },
    );
  }
}

export async function loginAccount(
  email: string,
  password: string,
): Promise<AuthSession> {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Não foi possível entrar na conta."),
      { cause: error },
    );
  }
}

export async function getCurrentSession(): Promise<CurrentSession> {
  try {
    const response = await api.get<CurrentSession>("/auth/session");
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Sua sessão não é mais válida."),
      { cause: error },
    );
  }
}

export async function logoutAccount(token: string): Promise<void> {
  await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export function saveAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}