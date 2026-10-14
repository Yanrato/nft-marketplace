import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { Navbar } from "./components/layout/navbar/Navbar";
import { MobileSearchBar } from "./components/layout/mobile/MobileSearchBar";
import { Footer } from "./components/layout/footer/Footer";
import { MobileBottomNav } from "./components/layout/mobile/MobileBottomNav";
import { AuthModal } from "./components/layout/auth/AuthModal";
import { useCart } from "@/features/cart/CartContext";

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { itemCount } = useCart();

  const activeTab =
    location.pathname === "/"
      ? "Início"
      : location.pathname.startsWith("/nft")
        ? "Mercado"
        : "";

  return (
    <div className="min-h-screen bg-[#140D0A] text-white pb-20 md:pb-0 flex flex-col justify-between">
      <Navbar
        activeTab={activeTab}
        cartCount={itemCount}
        onLoginClick={() => setIsAuthOpen(true)}
      />

      <MobileSearchBar />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          navigate({ to: "/perfil" });
        }}
      />

      <div className="flex-1 w-full">
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
