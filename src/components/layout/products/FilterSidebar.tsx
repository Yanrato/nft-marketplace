import { useState } from 'react';

const collections = [
  { name: 'Arte digital', count: 33 },
  { name: 'Fotografia', count: 12 },
  { name: 'Música', count: 65 },
  { name: 'Arte 3D', count: 39 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 18 },
];

const networks = [
  { name: 'Ethereum', count: 119 },
  { name: 'Polygon', count: 78 },
  { name: 'Solana', count: 86 },
];

export function FilterSidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Arte digital');
  const [priceRange] = useState('0,02 - 12,30 ETH');

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-8 font-mono">
      
      {/* 1. Filtro: Coleções */}
      <div>
        <h3 className="text-sm font-bold text-neutral-100 mb-4">Coleções</h3>
        <ul className="space-y-2.5 text-xs">
          {collections.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setSelectedCategory(item.name)}
                className={`w-full flex items-center justify-between text-left transition-colors ${
                  selectedCategory === item.name
                    ? 'text-amber-500 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{item.name}</span>
                <span className="text-neutral-500">({item.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Filtro: Faixa de Preço */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-neutral-100">Faixa de preço</h3>
        
        {/* Barra de controle simulada */}
        <div className="relative w-full h-1 bg-amber-900/50 rounded-full my-4">
          <div className="absolute left-1/6 right-1/4 h-full bg-amber-500 rounded-full" />
          <div className="absolute left-1/6 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full cursor-pointer shadow" />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-amber-500 rounded-full cursor-pointer shadow" />
        </div>

        <p className="text-xs text-neutral-400">Preço: {priceRange}</p>

        <button
          type="button"
          className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-4 py-1.5 rounded transition-colors"
        >
          Aplicar
        </button>
      </div>

      {/* 3. Filtro: Rede */}
      <div>
        <h3 className="text-sm font-bold text-neutral-100 mb-4">Rede</h3>
        <ul className="space-y-2.5 text-xs">
          {networks.map((net) => (
            <li key={net.name}>
              <button
                type="button"
                className="w-full flex items-center justify-between text-neutral-400 hover:text-white transition-colors"
              >
                <span>{net.name}</span>
                <span className="text-neutral-500">({net.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Banner Lateral: NFT EM DESTAQUE - OFERTA LIMITADA */}
      <div className="mt-4 p-4 rounded-2xl bg-[#1C120C] border border-amber-900/30 flex flex-col gap-3">
        <div>
          <span className="text-[11px] font-bold text-amber-500 tracking-wider block">
            NFT EM DESTAQUE
          </span>
          <span className="text-xs font-extrabold text-white tracking-wider block">
            OFERTA LIMITADA
          </span>
        </div>
        
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
            alt="NFT Destaque"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    </aside>
  );
}