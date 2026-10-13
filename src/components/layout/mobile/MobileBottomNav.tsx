import { Home, Heart, ShoppingCart, User, Scan } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab?: 'home' | 'favorites' | 'cart' | 'profile';
  cartCount?: number;
}

export function MobileBottomNav({ activeTab = 'home', cartCount = 6 }: MobileBottomNavProps) {
  return (
    <nav 
      aria-label="Navegação mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#160E0A]/95 backdrop-blur-md border-t border-white/10 px-6 py-2"
    >
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        
        {/* 1. Início */}
        <button 
          type="button" 
          aria-label="Início"
          className={`p-2 transition-colors ${activeTab === 'home' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}
        >
          <Home className="w-5 h-5 fill-current" />
        </button>

        {/* 2. Favoritos */}
        <button 
          type="button" 
          aria-label="Favoritos"
          className={`p-2 transition-colors ${activeTab === 'favorites' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* 3. Botão Central em Destaque (Scanner / Ação Rápida) */}
        <div className="relative -top-5">
          <button 
            type="button"
            aria-label="Ação rápida"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-600/30 hover:scale-105 transition-transform"
          >
            <Scan className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Carrinho */}
        <button 
          type="button" 
          aria-label={`Carrinho com ${cartCount} itens`}
          className={`p-2 relative transition-colors ${activeTab === 'cart' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-amber-500 text-neutral-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* 5. Perfil */}
        <button 
          type="button" 
          aria-label="Perfil do usuário"
          className={`p-2 transition-colors ${activeTab === 'profile' ? 'text-amber-500' : 'text-neutral-400 hover:text-white'}`}
        >
          <User className="w-5 h-5" />
        </button>

      </div>
    </nav>
  );
}