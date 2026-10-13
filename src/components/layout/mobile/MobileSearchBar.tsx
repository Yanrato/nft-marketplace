import { Search, SlidersHorizontal } from 'lucide-react';

interface MobileSearchBarProps {
  onFilterClick?: () => void;
}

export function MobileSearchBar({ onFilterClick }: MobileSearchBarProps) {
  return (
    <div className="md:hidden px-4 pt-4 pb-2 flex items-center gap-3">
      {/* Campo de Busca */}
      <div className="flex-1 flex items-center gap-2 bg-[#20150F] border border-white/5 rounded-2xl px-3.5 py-2.5">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Explorar coleções"
          className="bg-transparent text-xs font-mono text-neutral-200 placeholder-neutral-500 outline-none w-full"
        />
      </div>

      {/* Botão de Filtro Lateral */}
      <button
        type="button"
        onClick={onFilterClick}
        aria-label="Abrir filtros"
        className="bg-amber-600 hover:bg-amber-500 text-neutral-950 p-2.5 rounded-xl transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}