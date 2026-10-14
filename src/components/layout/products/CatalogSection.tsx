import { useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useNFTs } from '@/hooks/useNFTs';
import type { HomeSearch } from '@/features/catalog/search';
import { FilterSidebar } from './FilterSidebar';
import { ProductCard } from './ProductCard';

const homeRoute = getRouteApi('/');

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

// As abas são atalhos da mesma ordenação (uma única fonte de verdade: o parâmetro "sort")
const TABS: { label: string; sort: HomeSearch['sort'] }[] = [
  { label: 'Todos os NFTs', sort: undefined },
  { label: 'Novos lançamentos', sort: 'recent' },
  { label: 'Em alta', sort: 'popular' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Padrão' },
  { value: 'recent', label: 'Listados recentemente' },
  { value: 'popular', label: 'Mais avaliados' },
  { value: 'price-asc', label: 'Preço: menor para maior' },
  { value: 'price-desc', label: 'Preço: maior para menor' },
];

export function CatalogSection() {
  const search = homeRoute.useSearch();
  const navigate = useNavigate({ from: '/' });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = search.page ?? 1;
  const { data, isPending, isError, isFetching, isPlaceholderData, refetch } = useNFTs({
    search: search.q,
    category: search.category,
    network: search.network,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    sort: search.sort,
    page,
  });

  // Mudar qualquer filtro/ordenação adiciona ao histórico e volta para a página 1
  const setFilters = (patch: Partial<HomeSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch, page: undefined }) });

  const setPage = (next: number) =>
    navigate({ search: (prev) => ({ ...prev, page: next > 1 ? next : undefined }) });

  const clearFilters = () => navigate({ search: {} });

  const filterSidebar = (
    <FilterSidebar search={search} onChange={setFilters} onClear={clearFilters} />
  );

  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-titulo"
      className="w-full bg-[#140D0A] px-6 md:px-12 lg:px-24 py-12 border-t border-white/5"
    >
      <h2 id="catalogo-titulo" className="sr-only">
        Catálogo de NFTs
      </h2>

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Filtros: fixos no desktop, em gaveta no mobile/tablet */}
        <div className="hidden lg:block lg:w-64 shrink-0">{filterSidebar}</div>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="left" className="overflow-y-auto bg-[#140D0A] p-6 lg:hidden">
            <SheetHeader className="p-0">
              <SheetTitle className="font-mono text-white">Filtros</SheetTitle>
              <SheetDescription className="sr-only">
                Filtre o catálogo por coleção, faixa de preço e rede.
              </SheetDescription>
            </SheetHeader>
            {filterSidebar}
          </SheetContent>
        </Sheet>

        {/* Vitrine */}
        <div className="flex-1 flex flex-col gap-8 font-mono min-w-0">
          {/* Abas e ordenação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {TABS.map((tab) => {
                const active = search.sort === tab.sort;
                return (
                  <button
                    key={tab.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters({ sort: tab.sort })}
                    className={`pb-1 transition-colors relative rounded ${focusRing} ${
                      active ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {active && (
                      <span aria-hidden="true" className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={`lg:hidden flex items-center gap-1.5 text-neutral-200 border border-white/15 rounded-lg px-3 py-1.5 ${focusRing}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                Filtros
              </button>

              <label className="flex items-center gap-2 text-neutral-400">
                <span>Ordenar por:</span>
                <select
                  value={search.sort ?? 'default'}
                  onChange={(e) =>
                    setFilters({
                      sort: e.target.value === 'default' ? undefined : (e.target.value as HomeSearch['sort']),
                    })
                  }
                  className={`bg-[#1A110B] border border-white/10 rounded-md px-2 py-1.5 text-neutral-200 ${focusRing}`}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Resultado e atualização em segundo plano (anunciados aos leitores de tela) */}
          <div className="flex items-center justify-between text-xs text-neutral-400 min-h-4">
            <p role="status" aria-live="polite">
              {isPending
                ? 'Carregando NFTs…'
                : data
                  ? `${data.total} ${data.total === 1 ? 'NFT encontrado' : 'NFTs encontrados'}`
                  : ''}
            </p>
            {isFetching && !isPending && <span aria-hidden="true">Atualizando…</span>}
          </div>

          {/* Grade: skeleton, erro, vazio ou resultados */}
          <div
            aria-busy={isFetching}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity motion-reduce:transition-none ${
              isPlaceholderData ? 'opacity-60' : ''
            }`}
          >
            {isPending ? (
              // Mesmas proporções do card real: não há deslocamento de layout ao carregar
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <Skeleton className="w-full aspect-square rounded-2xl" />
                  <div className="flex flex-col gap-0.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            ) : isError ? (
              <div role="alert" className="col-span-full py-12 text-center space-y-3">
                <p className="text-sm text-red-400">Não foi possível carregar o catálogo.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className={`bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-5 py-2 rounded-lg ${focusRing}`}
                >
                  Tentar novamente
                </button>
              </div>
            ) : data && data.data.length === 0 ? (
              <div className="col-span-full py-16 text-center space-y-2">
                <p className="text-sm font-bold text-neutral-200">Nenhum NFT encontrado</p>
                <p className="text-xs text-neutral-400">
                  Tente outros termos ou remova alguns filtros.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-2 text-xs text-amber-500 underline underline-offset-2 ${focusRing}`}
                >
                  Limpar filtros
                </button>
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
          {data && data.totalPages > 1 && (
            <nav aria-label="Paginação" className="flex justify-end items-center gap-2 text-xs pt-8">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 ${focusRing}`}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              {Array.from({ length: data.totalPages }).map((_, idx) => {
                const n = idx + 1;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Página ${n}`}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${focusRing} ${
                      n === page
                        ? 'bg-amber-600 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                type="button"
                aria-label="Próxima página"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
                className={`w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 ${focusRing}`}
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}