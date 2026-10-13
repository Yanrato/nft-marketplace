import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNFTs } from '../../../hooks/useNFTs';

export function CatalogSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'trending'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Consumindo a API simulada via TanStack Query + Axios + MSW
  const { data, isLoading, isError } = useNFTs({ page: currentPage });

  return (
    <section className="w-full bg-[#140D0A] px-6 md:px-12 lg:px-24 py-12 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Barra Lateral */}
        <FilterSidebar />

        {/* Vitrine */}
        <main className="flex-1 flex flex-col gap-8 font-mono">
          
          {/* Abas e Ordenação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border-b border-white/10 pb-4">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`pb-1 transition-colors relative ${activeTab === 'all' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Todos os NFTs
                {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`pb-1 transition-colors ${activeTab === 'new' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Novos lançamentos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('trending')}
                className={`pb-1 transition-colors ${activeTab === 'trending' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                Em alta
              </button>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>Ordenar por: <strong className="text-neutral-200">Listados recentemente</strong></span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Grade de Cards com Skeletons Shimmer durante o carregamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // 6 Skeletons enquanto o MSW simula o delay da rede
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse">
                  <div className="w-full aspect-square rounded-2xl bg-neutral-900 border border-white/5" />
                  <div className="h-3 w-3/4 bg-neutral-800 rounded" />
                  <div className="h-3 w-1/3 bg-amber-900/40 rounded" />
                </div>
              ))
            ) : isError ? (
              <div className="col-span-3 py-12 text-center text-red-400 text-xs">
                Erro ao carregar catálogo. Tente novamente mais tarde.
              </div>
            ) : (
              data?.data.map((nft) => (
                <ProductCard
                  key={nft.id}
                  nft={{
                    id: nft.id,
                    name: nft.name,
                    price: nft.price,
                    originalPrice: nft.originalPrice,
                    imageUrl: nft.imageUrl,
                    badge: nft.badge,
                  }}
                />
              ))
            )}
          </div>

          {/* Paginação */}
          {data && (
            <nav aria-label="Paginação" className="flex justify-end items-center gap-2 text-xs pt-8">
              {Array.from({ length: data.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                      currentPage === pageNum ? 'bg-amber-600 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Próxima página"
                disabled={currentPage >= data.totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}

        </main>
      </div>
    </section>
  );
}