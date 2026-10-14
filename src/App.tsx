
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Navbar } from "./components/layout/navbar/Navbar";
import { MobileSearchBar } from "./components/layout/mobile/MobileSearchBar";
import { Footer } from "./components/layout/footer/Footer";
import { MobileBottomNav } from "./components/layout/mobile/MobileBottomNav";
import { AuthModal } from "./components/layout/auth/AuthModal";
import { useCart } from "@/features/cart/useCart";
import { useAuth } from "@/features/auth/useAuth";

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const activeTab =
    location.pathname === "/"
      ? "Início"
      : location.pathname.startsWith("/nft")
        ? "Mercado"
        : "";

  function handleLogout() {
    logout();
    setIsAuthOpen(false);
    void navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#140D0A] pb-20 text-white md:pb-0">
      <Navbar
        activeTab={activeTab}
        cartCount={itemCount}
        isAuthenticated={isAuthenticated}
        username={user?.username}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <MobileSearchBar />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          void navigate({ to: "/perfil" });
        }}
      />

      <div className="w-full flex-1">
        <Outlet />
      </div>

      <Footer />

      <MobileBottomNav
        activeTab={
          location.pathname === "/carrinho"
            ? "cart"
            : location.pathname === "/perfil"
              ? "profile"
              : "home"
        }
        cartCount={itemCount}
      />
    </div>
  );
}

export default App;
