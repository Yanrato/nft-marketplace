import { Heart } from 'lucide-react';

export interface NFTItem {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  badge?: string;       // Ex: "RARO"
  isFavorite?: boolean;
}

interface ProductCardProps {
  nft: NFTItem;
  onClick?: () => void;
  onToggleFavorite?: (id: string) => void;
}

export function ProductCard({ nft, onClick, onToggleFavorite }: ProductCardProps) {
  return (
    <article 
      onClick={onClick}
      className="group relative flex flex-col gap-2.5 cursor-pointer"
    >
      {/* Container da Imagem */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#1C120D] border border-white/5">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge "RARO" (caso tenha) */}
        {nft.badge && (
          <span className="absolute top-0 left-0 bg-amber-600 text-neutral-950 font-mono font-bold text-[10px] px-2.5 py-1 rounded-br-lg uppercase tracking-wider">
            {nft.badge}
          </span>
        )}

        {/* Botão de Favorito (Coração) */}
        <button
          type="button"
          aria-label="Favoritar"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(nft.id);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-neutral-300 hover:text-amber-500 transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${nft.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>
      </div>

      {/* Nome e Preço */}
      <div className="font-mono flex flex-col gap-0.5">
        <h3 className="text-xs text-neutral-300 truncate">
          {nft.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-500">
            {nft.price} ETH
          </span>
          {nft.originalPrice && (
            <span className="text-[10px] text-neutral-500 line-through">
              {nft.originalPrice} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  );
}