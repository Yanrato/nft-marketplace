import { useState } from 'react';
import { Star, Minus, Plus, Heart, ZoomIn, Mail } from 'lucide-react';

export function NFTTopSection() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState('1/50');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const galleryImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  ];

  const editions = ['1/1', '1/10', '1/50', 'ABERTA'];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
      
      {/* Galeria de Fotos */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        {/* Miniaturas verticais */}
        <div className="flex sm:flex-col gap-3 shrink-0">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 border transition-all ${
                selectedImage === idx ? 'border-amber-500 scale-95 shadow-md' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Imagem Principal */}
        <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
          <img
            src={galleryImages[selectedImage]}
            alt="Emerald Ape #042"
            className="w-full h-full object-cover"
          />
          <button 
            type="button" 
            aria-label="Ampliar imagem"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-neutral-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Caixa de Informações e Compra */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Emerald Ape #042
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xl font-extrabold text-amber-500">
              1.19 ETH
            </span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px]">19 avaliações de colecionadores</span>
            </div>
          </div>
        </div>

        {/* Sobre */}
        <div className="space-y-1.5 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
          <span className="text-neutral-200 font-bold block">Sobre este NFT:</span>
          <p>
            Um colecionável digital finalizado à mão da coleção Kurio Editions, 
            verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.
          </p>
        </div>

        {/* Edições */}
        <div className="space-y-2">
          <span className="text-xs text-neutral-200 font-bold block">Edição:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {editions.map((ed) => (
              <button
                key={ed}
                type="button"
                onClick={() => setSelectedEdition(ed)}
                className={`px-3 py-1.5 rounded-full border transition-colors ${
                  selectedEdition === ed
                    ? 'border-amber-500 text-amber-500 bg-amber-500/10 font-bold'
                    : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {ed}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de Quantidade + Botão Comprar */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center bg-[#1E130D] border border-white/10 rounded-lg p-1">
            <button
              type="button"
              aria-label="Diminuir"
              disabled={quantity <= 1}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-white">{quantity}</span>
            <button
              type="button"
              aria-label="Aumentar"
              onClick={() => setQuantity(q => q + 1)}
              className="p-1.5 text-neutral-400 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            className="flex-1 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider transition-colors shadow-md"
          >
            COMPRAR
          </button>

          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isFavorite
                ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                : 'border-white/15 text-neutral-300 hover:border-amber-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span>Favoritar</span>
          </button>
        </div>

        {/* Metadados Técnicos */}
        <div className="space-y-1.5 text-xs text-neutral-400 border-t border-white/5 pt-4">
          <p><strong className="text-neutral-300">ID do token:</strong> #0042</p>
          <p><strong className="text-neutral-300">Coleção:</strong> Kurio Apes</p>
          <p><strong className="text-neutral-300">Atributos:</strong> Óculos, Esmeralda, Raro</p>
          
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="text-neutral-300">Compartilhar este NFT:</span>
            <div className="flex items-center gap-2 text-neutral-400">
       
              <Mail className="w-4 h-4 hover:text-white cursor-pointer" />
              
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}