
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  LogIn,
  LogOut,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  cartCount?: number;
  activeTab?: string;
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
  username?: string;
  onLogout?: () => void;
}

export function Navbar({
  cartCount = 0,
  activeTab = "Início",
  onLoginClick,
  isAuthenticated = false,
  username,
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Início", to: "/" },
    { label: "Mercado", to: "/" },
    { label: "Criadores", to: "/" },
    { label: "Aprenda", to: "/" },
  ];

  function openProfile() {
    setIsMobileMenuOpen(false);
    void navigate({ to: "/perfil" });
  }

  function handleLogin() {
    setIsMobileMenuOpen(false);
    onLoginClick?.();
  }

  function handleLogout() {
    setIsMobileMenuOpen(false);
    onLogout?.();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#140D0A] px-6 md:px-12 lg:px-24">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-neutral-100 transition-opacity hover:opacity-90"
          >
            KURIO
          </Link>
        </div>

        <nav className="hidden items-center gap-10 font-mono text-xs md:flex">
          {navItems.map((item) => {
            const isActive = item.label === activeTab;

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative flex h-16 items-center transition-colors ${
                  isActive
                    ? "font-semibold text-amber-500"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="Buscar"
            className="p-1 text-neutral-200 transition-colors hover:text-white"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            aria-label={`Carrinho com ${cartCount} itens`}
            onClick={() => void navigate({ to: "/carrinho" })}
            className="relative cursor-pointer p-1 text-neutral-200 transition-colors hover:text-white"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-neutral-950">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={openProfile}
                className="inline-flex max-w-36 items-center gap-1.5 truncate rounded-md border border-white/10 px-3 py-1.5 font-sans text-xs font-semibold text-neutral-200 transition-colors hover:border-amber-500/50 hover:text-amber-400"
              >
                <UserRound className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{username || "Meu perfil"}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sair da conta"
                title="Sair"
                className="p-1.5 text-neutral-400 transition-colors hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="hidden cursor-pointer items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-1.5 font-sans text-xs font-semibold text-neutral-950 shadow-sm transition-colors hover:bg-amber-400 sm:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar</span>
            </button>
          )}

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="p-1 text-neutral-300 hover:text-white md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="flex flex-col gap-4 border-t border-white/5 py-4 font-mono text-xs md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={
                item.label === activeTab
                  ? "font-semibold text-amber-500"
                  : "text-neutral-300 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={openProfile}
                className="flex items-center justify-center gap-2 rounded-md border border-white/10 py-2 text-neutral-200"
              >
                <UserRound className="h-4 w-4" />
                <span>Meu perfil ({username})</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-md bg-red-500/10 py-2 text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-amber-500 py-2 text-xs font-semibold text-neutral-950"
            >
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
