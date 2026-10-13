import { useState } from 'react';

export function NFTDescription() {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  return (
    <section className="border-t border-white/10 pt-8 font-mono">
      {/* Abas */}
      <div className="flex items-center gap-8 border-b border-white/10 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`relative pb-3 transition-colors ${
            activeTab === 'details' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Detalhes do NFT
          {activeTab === 'details' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors ${
            activeTab === 'reviews' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Avaliações de colecionadores (19)
        </button>
      </div>

      {/* Conteúdo */}
      <div className="py-6 space-y-4 text-xs text-neutral-400 leading-relaxed max-w-4xl">
        <p>
          Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.
        </p>
        <p>
          A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrado na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
        </p>
        
        <div className="pt-2 space-y-2">
          <p><strong className="text-neutral-200">Rede:</strong> Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.</p>
          <p><strong className="text-neutral-200">Contrato:</strong> Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</p>
          <p><strong className="text-neutral-200">Direitos autorais:</strong> <code className="text-amber-500">0x7A42...19E8</code> • Contrato inteligente ERC-721 verificado.</p>
        </div>
      </div>
    </section>
  );
}