import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  imageUrl?: string;
}

export function Hero({ onExploreClick }: HeroProps) {
  const monkey1 = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
  const monkey2 = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop";

  return (
    <section className="w-full bg-[#140D0A] px-4 md:px-12 lg:px-24 py-4 md:py-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* === VERSÃO MOBILE (Card com gradiente e avatares sobrepostos) === */}
        <div className="md:hidden relative w-full rounded-3xl bg-gradient-to-br from-[#452918] via-[#2A180E] to-[#1C1009] p-5 border border-amber-900/40 shadow-xl overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            
            {/* Textos */}
            <div className="flex-1 space-y-2 z-10">
              <span className="font-mono text-[10px] text-neutral-300 block">
                Bem-vindo à Kurio
              </span>
              <h1 className="font-mono text-sm font-extrabold text-white uppercase leading-tight tracking-tight">
                SEJA DONO DA <br />
                CULTURA DIGITAL
              </h1>
              <p className="font-mono text-[10px] text-neutral-300 leading-snug max-w-[160px]">
                Descubra NFTs selecionados de criadores do mundo todo.
              </p>
              <button
                type="button"
                onClick={onExploreClick}
                className="font-mono text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 pt-1"
              >
                <span>EXPLORAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatares Sobrepostos */}
            <div className="relative w-32 h-32 shrink-0">
              {/* Avatar Principal */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-900 absolute right-0 top-0 border border-white/10 shadow-lg">
                <img src={monkey1} alt="NFT Ape" className="w-full h-full object-cover" />
              </div>
              {/* Avatar Secundário Sobreposto */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 absolute left-2 bottom-0 border-2 border-[#2A180E] shadow-xl z-20">
                <img src={monkey2} alt="NFT Ape Secundário" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>

          {/* 3 Pontos Indicadores */}
          <div className="flex justify-center items-center gap-1.5 pt-4">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="w-2 h-2 rounded-full bg-amber-500/40" />
            <span className="w-2 h-2 rounded-full bg-amber-500/40" />
          </div>
        </div>

        {/* === VERSÃO DESKTOP (Mantém o layout grande em 2 colunas) === */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="font-mono text-xs tracking-wider text-neutral-400 block">
              Bem-vindo à Kurio
            </span>
            <h1 className="font-mono text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase leading-tight">
              SEJA DONO DO FUTURO <br />
              DA ARTE DIGITAL
            </h1>
            <p className="font-mono text-sm text-neutral-400 leading-relaxed max-w-lg">
              Descubra NFTs selecionados de criadores emergentes e consagrados. 
              Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>
            <button
              type="button"
              onClick={onExploreClick}
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-mono font-bold text-xs uppercase px-8 py-3.5 rounded-lg transition-colors"
            >
              EXPLORAR
            </button>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-[450px] aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-white/5 bg-neutral-900">
              <img src={monkey1} alt="NFT Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}