
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (usernameOrEmail: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isSubmitting) return;

    if (mode === "register" && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(username, email, password);
        onSuccess?.(username.trim());
      } else {
        await login(email, password);
        onSuccess?.(email.trim());
      }

      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível concluir a operação."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-mono text-white backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative flex w-full max-w-[420px] flex-col gap-5 overflow-hidden rounded-2xl border border-amber-900/30 bg-[#160E0A] p-6 shadow-2xl sm:p-8"
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 p-1 text-neutral-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center gap-3 pt-2 text-lg font-bold">
          <button
            type="button"
            onClick={() => changeMode("login")}
            className={
              mode === "login"
                ? "text-amber-500"
                : "text-neutral-300 hover:text-white"
            }
          >
            Entrar
          </button>

          <span className="text-neutral-600">|</span>

          <button
            type="button"
            onClick={() => changeMode("register")}
            className={
              mode === "register"
                ? "text-amber-500"
                : "text-neutral-300 hover:text-white"
            }
          >
            Criar conta
          </button>
        </div>

        <h2 id="auth-modal-title" className="sr-only">
          {mode === "register" ? "Criar conta" : "Entrar"}
        </h2>

        <p className="mx-auto max-w-[320px] text-center text-xs leading-relaxed text-neutral-400">
          {mode === "register"
            ? "Crie seu perfil de colecionador e conecte uma carteira quando quiser."
            : "Entre para gerenciar sua carteira, coleção e perfil de criador."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
          {mode === "register" && (
            <input
              type="text"
              required
              minLength={3}
              autoComplete="username"
              placeholder="Nome de usuário"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1F140D] px-3.5 py-3 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-600"
            />
          )}

          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#1F140D] px-3.5 py-3 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-600"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1F140D] px-3.5 py-3 pr-11 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-600"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {mode === "register" && (
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1F140D] px-3.5 py-3 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-amber-600"
            />
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <span className="text-xs text-neutral-500">
                Recuperação de senha indisponível na demonstração
              </span>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full cursor-pointer rounded-lg bg-amber-600 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-950 shadow-md transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Aguarde..."
              : mode === "register"
                ? "Criar conta"
                : "Entrar"}
          </button>
        </form>

        <div className="relative my-1 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#160E0A] px-3 text-[11px] text-neutral-400">
            Login social
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() =>
              setError("O login com Google ainda não está integrado.")
            }
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#1F140D] px-4 py-2.5 text-xs text-neutral-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <span className="font-bold text-blue-400">G</span>
            Continuar com Google
          </button>

          <button
            type="button"
            onClick={() =>
              setError("O login com Facebook ainda não está integrado.")
            }
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#1F140D] px-4 py-2.5 text-xs text-neutral-300 transition-colors hover:border-white/20 hover:text-white"
          >
            <span className="text-base font-bold text-blue-500">f</span>
            Continuar com Facebook
          </button>
        </div>
      </section>
    </div>
  );
}

export default AuthModal;
