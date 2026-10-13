import { ArrowRight } from 'lucide-react';

interface PromoCardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkText?: string;
  onExplore?: () => void;
}

const promoCards: PromoCardData[] = [
  {
    id: 'promo-1',
    title: 'Lançamentos gênesis\nde edição limitada',
    description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
    linkText: 'Explorar',
  },
  {
    id: 'promo-2',
    title: 'Arte digital selecionada\ne muito mais',
    description: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=500&auto=format&fit=crop',
    linkText: 'Explorar',
  },
];

export function PromoSection() {
  return (
    <section className="w-full bg-[#140D0A] px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {promoCards.map((card) => (
          <div
            key={card.id}
            className="relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-[#1C120C] border border-white/5 overflow-hidden shadow-lg group hover:border-amber-900/40 transition-colors"
          >
            {/* 1. Imagem do NFT com cantos arredondados */}
            <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden shrink-0 bg-neutral-900 border border-white/5">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* 2. Conteúdo: Título, Descrição e Botão */}
            <div className="flex flex-col items-start justify-center gap-4 font-mono w-full">
              {/* Título */}
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug whitespace-pre-line">
                {card.title}
              </h3>

              {/* Descrição */}
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
                {card.description}
              </p>

              {/* Botão Explorar */}
              <button
                type="button"
                onClick={card.onExplore}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <span>{card.linkText || 'Explorar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}

export default PromoSection;