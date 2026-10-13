import { useState } from 'react';
import { Search, ShoppingCart, LogIn, Menu, X } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

interface NavbarProps {
  cartCount?: number;
  activeTab?: string;
  onLoginClick?: () => void;
}

export function Navbar({ cartCount = 6, activeTab = 'Início', onLoginClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Início', to: '/' },
    { label: 'Mercado', to: '/' },
    { label: 'Criadores', to: '/' },
    { label: 'Aprenda', to: '/' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#140D0A] border-b border-white/10 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16">
        
        {/* 1. Logo KURIO com Link do TanStack Router para a Home */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="font-mono text-sm tracking-[0.25em] font-bold text-neutral-100 uppercase hover:opacity-90 transition-opacity"
          >
            KURIO
          </Link>
        </div>

        {/* 2. Menu Central Desktop com Links do TanStack Router */}
        <nav className="hidden md:flex items-center gap-10 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = item.label === activeTab;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative h-16 flex items-center transition-colors ${
                  isActive ? 'text-amber-500 font-semibold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {/* Linha indicadora ativa na borda inferior */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Ações da Direita */}
        <div className="flex items-center gap-5">
          {/* Botão de Busca */}
          <button 
            type="button" 
            aria-label="Buscar"
            className="text-neutral-200 hover:text-white transition-colors p-1"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Carrinho com Navegação para /carrinho */}
          <button 
            type="button" 
            aria-label={`Carrinho com ${cartCount} itens`}
            onClick={() => navigate({ to: '/carrinho' })}
            className="relative text-neutral-200 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <ShoppingCart className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botão Entrar (Abre a Modal de Login) */}
          <button
            type="button"
            onClick={onLoginClick}
            className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-sans font-semibold text-xs px-3.5 py-1.5 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>

          {/* Menu Mobile Hambúrguer */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-1"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 4. Menu Mobile Aberto */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-white/5 flex flex-col gap-4 font-mono text-xs">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={item.label === activeTab ? 'text-amber-500 font-semibold' : 'text-neutral-300'}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLoginClick?.();
            }}
            className="flex items-center justify-center gap-2 bg-amber-500 text-neutral-950 font-semibold text-xs py-2 rounded-md mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;