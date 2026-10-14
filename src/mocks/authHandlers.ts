import { delay, http, HttpResponse } from "msw";
import type { AuthUser } from "@/features/auth/auth-context";

const USERS_KEY = "kurio_api_users_v1";
const SESSIONS_KEY = "kurio_api_sessions_v1";
const SESSION_DURATION_MS = 30 * 60 * 1000;

interface StoredUser extends AuthUser {
  passwordSalt: string;
  passwordHash: string;
}

interface StoredSession {
  token: string;
  userId: string;
  expiresAt: number;
}

interface RegisterBody {
  username?: unknown;
  email?: unknown;
  password?: unknown;
}

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function saveArray<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function publicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function errorResponse(
  code: string,
  message: string,
  status: number,
  fields?: Record<string, string>,
) {
  return HttpResponse.json(
    { code, message, ...(fields ? { fields } : {}) },
    { status },
  );
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

function createSalt(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

async function hashPassword(
  password: string,
  saltHex: string,
): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const saltBuffer = new ArrayBuffer(16);
  new Uint8Array(saltBuffer).set(hexToBytes(saltHex));

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return bytesToHex(new Uint8Array(bits));
}

function createSession(user: StoredUser) {
  const token = `${crypto.randomUUID()}${crypto.randomUUID().replaceAll("-", "")}`;

  const session: StoredSession = {
    token,
    userId: user.id,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  const sessions = readArray<StoredSession>(SESSIONS_KEY).filter(
    (item) => item.expiresAt > Date.now() && item.userId !== user.id,
  );

  saveArray(SESSIONS_KEY, [...sessions, session]);

  return {
    user: publicUser(user),
    token,
    expiresAt: session.expiresAt,
  };
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  if (!header) return null;

  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match?.[1] ?? null;
}

function findSession(
  request: Request,
): { session: StoredSession; user: StoredUser } | null {
  const token = getBearerToken(request);
  if (!token) return null;

  const sessions = readArray<StoredSession>(SESSIONS_KEY);
  const session = sessions.find((item) => item.token === token);

  if (!session || session.expiresAt <= Date.now()) {
    saveArray(
      SESSIONS_KEY,
      sessions.filter(
        (item) => item.token !== token && item.expiresAt > Date.now(),
      ),
    );

    return null;
  }

  const user = readArray<StoredUser>(USERS_KEY).find(
    (item) => item.id === session.userId,
  );

  if (!user) return null;

  return { session, user };
}

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    await delay(250);

    let body: RegisterBody;

    try {
      body = (await request.json()) as RegisterBody;
    } catch {
      return errorResponse(
        "VALIDATION_ERROR",
        "Os dados enviados são inválidos.",
        400,
      );
    }

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    const fields: Record<string, string> = {};

    if (username.length < 3 || username.length > 24) {
      fields.username =
        "O nome de usuário deve ter entre 3 e 24 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fields.email = "Informe um e-mail válido.";
    }

    if (password.length < 8 || password.length > 128) {
      fields.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    if (Object.keys(fields).length > 0) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Confira os campos destacados.",
        400,
        fields,
      );
    }

    const users = readArray<StoredUser>(USERS_KEY);

    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === email ||
        user.username.toLowerCase() === username.toLowerCase(),
    );

    if (duplicate) {
      return errorResponse(
        "CONFLICT",
        "Este e-mail ou nome de usuário já está cadastrado.",
        409,
      );
    }

    try {
      const passwordSalt = createSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      const user: StoredUser = {
        id: crypto.randomUUID(),
        username,
        email,
        passwordSalt,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      saveArray(USERS_KEY, [...users, user]);

      return HttpResponse.json(createSession(user), { status: 201 });
    } catch {
      return errorResponse(
        "TRANSIENT_ERROR",
        "Não foi possível criar a conta. Tente novamente.",
        500,
      );
    }
  }),

  http.post("/api/auth/login", async ({ request }) => {
    await delay(250);

    let body: LoginBody;

    try {
      body = (await request.json()) as LoginBody;
    } catch {
      return errorResponse(
        "VALIDATION_ERROR",
        "Os dados enviados são inválidos.",
        400,
      );
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Informe e-mail e senha.",
        400,
      );
    }

    const user = readArray<StoredUser>(USERS_KEY).find(
      (item) => item.email.toLowerCase() === email,
    );

    if (!user) {
      return errorResponse(
        "UNAUTHORIZED",
        "E-mail ou senha incorretos.",
        401,
      );
    }

    try {
      const passwordHash = await hashPassword(password, user.passwordSalt);

      if (passwordHash !== user.passwordHash) {
        return errorResponse(
          "UNAUTHORIZED",
          "E-mail ou senha incorretos.",
          401,
        );
      }

      return HttpResponse.json(createSession(user));
    } catch {
      return errorResponse(
        "TRANSIENT_ERROR",
        "Não foi possível iniciar a sessão. Tente novamente.",
        500,
      );
    }
  }),

  http.get("/api/auth/session", async ({ request }) => {
    await delay(100);

    const result = findSession(request);

    if (!result) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sua sessão expirou. Entre novamente.",
        401,
      );
    }

    return HttpResponse.json({
      user: publicUser(result.user),
      expiresAt: result.session.expiresAt,
    });
  }),

  http.post("/api/auth/logout", async ({ request }) => {
    await delay(50);

    const token = getBearerToken(request);

    if (token) {
      const sessions = readArray<StoredSession>(SESSIONS_KEY);

      saveArray(
        SESSIONS_KEY,
        sessions.filter((item) => item.token !== token),
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];