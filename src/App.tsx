import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { Navbar } from "./components/layout/navbar/Navbar";
import { MobileSearchBar } from "./components/layout/mobile/MobileSearchBar";
import { Footer } from "./components/layout/footer/Footer";
import { MobileBottomNav } from "./components/layout/mobile/MobileBottomNav";
import { AuthModal } from "./components/layout/auth/AuthModal";

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Identifica a aba ativa com base na URL atual
  const activeTab = 
    location.pathname === "/" ? "Início" :
    location.pathname.startsWith("/nft") ? "Mercado" : "";

  return (
    <div className="min-h-screen bg-[#140D0A] text-white pb-20 md:pb-0 flex flex-col justify-between">
      {/* 1. Navbar Global com links e ação de Login */}
      <Navbar 
        activeTab={activeTab} 
        cartCount={6} 
        onLoginClick={() => setIsAuthOpen(true)}
      />
      
      <MobileSearchBar />

      {/* 2. Modal de Login/Cadastro Global */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          navigate({ to: "/perfil" });
        }}
      />

      {/* 3. O miolo da página ativa renderizado pelo TanStack Router */}
      <div className="flex-1 w-full">
        <Outlet />
      </div>

      {/* 4. Rodapé Global */}
      <Footer />

      {/* 5. Barra Inferior Mobile */}
      <MobileBottomNav 
        activeTab={
          location.pathname === "/carrinho" ? "cart" :
          location.pathname === "/perfil" ? "profile" : "home"
        } 
      />
    </div>
  );
}

export default App;