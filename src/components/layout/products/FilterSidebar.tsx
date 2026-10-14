import { useId, useState } from 'react';
import Decimal from 'decimal.js';
import { Skeleton } from '@/components/ui/skeleton';
import { useNFTFacets } from '@/hooks/useNFTs';
import type { HomeSearch } from '@/features/catalog/search';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

interface FilterSidebarProps {
  search: HomeSearch;
  onChange: (patch: Partial<HomeSearch>) => void;
  onClear: () => void;
}

interface OptionListProps {
  title: string;
  items?: { name: string; count: number }[];
  selected?: string;
  onSelect: (name: string | undefined) => void;
}

// Lista de opções (coleções ou redes) com contagens reais vindas da API
function OptionList({ title, items, selected, onSelect }: OptionListProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="text-sm font-bold text-neutral-100 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5 text-xs">
        {!items
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))
          : items.map((item) => {
              const active = selected === item.name;
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelect(active ? undefined : item.name)}
                    className={`w-full flex items-center justify-between text-left transition-colors rounded ${focusRing} ${
                      active ? 'text-amber-500 font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>
                      {item.name}
                      {active && <span className="sr-only"> (selecionado)</span>}
                    </span>
                    <span className="text-neutral-500">({item.count})</span>
                  </button>
                </li>
              );
            })}
      </ul>
    </section>
  );
}

interface PriceFilterProps {
  min?: string;
  max?: string;
  bounds?: { min: string; max: string };
  onApply: (min?: string, max?: string) => void;
}

// Faixa de preço com campos rotulados e validação (erro associado ao campo)
function PriceFilter({ min, max, bounds, onApply }: PriceFilterProps) {
  const id = useId();
  const [minValue, setMinValue] = useState(min ?? '');
  const [maxValue, setMaxValue] = useState(max ?? '');
  const [error, setError] = useState<string | null>(null);

  const isDecimal = (v: string) => /^\d+(\.\d+)?$/.test(v);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lo = minValue.trim().replace(',', '.');
    const hi = maxValue.trim().replace(',', '.');

    if ((lo && !isDecimal(lo)) || (hi && !isDecimal(hi))) {
      setError('Use apenas números, por exemplo 0.5');
      return;
    }
    if (lo && hi && new Decimal(lo).gt(hi)) {
      setError('O valor mínimo não pode ser maior que o máximo.');
      return;
    }
    setError(null);
    onApply(lo || undefined, hi || undefined);
  };

  const inputClass = `w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus-visible:border-amber-600 focus-visible:ring-2 focus-visible:ring-amber-600/40 aria-[invalid=true]:border-red-500`;

  return (
    <form onSubmit={submit} noValidate className="space-y-3" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-sm font-bold text-neutral-100">
        Faixa de preço (ETH)
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor={`${id}-min`} className="text-[11px] text-neutral-400">
            Mínimo
          </label>
          <input
            id={`${id}-min`}
            inputMode="decimal"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder={bounds?.min}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${id}-max`} className="text-[11px] text-neutral-400">
            Máximo
          </label>
          <input
            id={`${id}-max`}
            inputMode="decimal"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder={bounds?.max}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={inputClass}
          />
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        className={`bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-4 py-1.5 rounded transition-colors ${focusRing}`}
      >
        Aplicar
      </button>
    </form>
  );
}

export function FilterSidebar({ search, onChange, onClear }: FilterSidebarProps) {
  const { data: facets, isError, refetch } = useNFTFacets();
  const hasFilters = Boolean(
    search.q || search.category || search.network || search.minPrice || search.maxPrice
  );

  return (
    <aside aria-label="Filtros do catálogo" className="w-full lg:w-64 flex flex-col gap-8 font-mono">
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className={`self-start text-xs text-amber-500 underline underline-offset-2 hover:text-amber-400 rounded ${focusRing}`}
        >
          Limpar filtros
        </button>
      )}

      {isError ? (
        <div role="alert" className="text-xs text-red-400 space-y-2">
          <p>Não foi possível carregar os filtros.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className={`underline underline-offset-2 ${focusRing}`}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <OptionList
            title="Coleções"
            items={facets?.categories}
            selected={search.category}
            onSelect={(category) => onChange({ category })}
          />

          {/* key: refaz os campos quando a URL muda (ex.: botão Voltar) */}
          <PriceFilter
            key={`${search.minPrice ?? ''}-${search.maxPrice ?? ''}`}
            min={search.minPrice}
            max={search.maxPrice}
            bounds={facets?.priceRange}
            onApply={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />

          <OptionList
            title="Rede"
            items={facets?.networks}
            selected={search.network}
            onSelect={(network) => onChange({ network: network as HomeSearch['network'] })}
          />
        </>
      )}

      {/* Banner lateral: NFT EM DESTAQUE */}
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