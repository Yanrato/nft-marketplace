import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const transactionData = {
    txId: '0xA91F...E02C',
    date: '29 Jul, 2026',
    total: '26.846 ETH',
    networkFee: '0.016 ETH',
    wallet: 'MetaMask',
    items: [
      {
        name: 'Emerald Ape #042',
        tokenId: '#0042',
        qty: 2,
        subtotal: '2.38 ETH',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
      },
      {
        name: 'Violet Nomad #314',
        tokenId: '#0314',
        qty: 6,
        subtotal: '8.34 ETH',
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop',
      },
      {
        name: 'Ivory Baron #088',
        tokenId: '#0088',
        qty: 9,
        subtotal: '16.11 ETH',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=200&auto=format&fit=crop',
      },
    ],
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 font-mono text-white">
      
      {/* Card Central / Modal do Recibo */}
      <div className="relative w-full max-w-lg bg-[#19100B] border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 overflow-hidden">
        
        {/* Borda decorativa âmbar inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />

        {/* Botão Fechar no canto superior */}
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          aria-label="Fechar recibo"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Ícone Envelope "THANK YOU" + Mensagem */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          {/* Ilustração Envelope Thank You */}
          <div className="relative w-14 h-14 rounded-xl border border-amber-500/60 flex flex-col items-center justify-center bg-amber-500/5 shadow-inner">
            <span className="text-[9px] font-extrabold text-amber-500 tracking-wider">THANK</span>
            <span className="text-[9px] font-extrabold text-amber-500 tracking-wider">YOU</span>
          </div>

          <p className="text-xs text-neutral-300 font-medium">
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        {/* 2. Barra de Metadados da Transação (4 Colunas) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-white/10 text-[10px]">
          <div className="sm:border-r sm:border-white/10 sm:pr-2">
            <span className="text-neutral-400 block">ID da transação</span>
            <strong className="text-neutral-200 block truncate">{transactionData.txId}</strong>
          </div>
          <div className="sm:border-r sm:border-white/10 sm:px-2">
            <span className="text-neutral-400 block">Data</span>
            <strong className="text-neutral-200 block">{transactionData.date}</strong>
          </div>
          <div className="sm:border-r sm:border-white/10 sm:px-2">
            <span className="text-neutral-400 block">Total</span>
            <strong className="text-amber-500 block">{transactionData.total}</strong>
          </div>
          <div className="sm:pl-2">
            <span className="text-neutral-400 block">Carteira</span>
            <strong className="text-neutral-200 block">{transactionData.wallet}</strong>
          </div>
        </div>

        {/* 3. Detalhes da Transação: Lista dos NFTs */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white tracking-wide">
            Detalhes da transação
          </h3>

          <div className="flex justify-between text-[11px] text-neutral-400 border-b border-white/5 pb-1">
            <span>NFTs</span>
            <div className="flex gap-8">
              <span>Edições</span>
              <span>Subtotal</span>
            </div>
          </div>

          <div className="space-y-3">
            {transactionData.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white truncate max-w-[130px] sm:max-w-[160px]">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400">ID do token: {item.tokenId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-right">
                  <span className="text-neutral-400 text-[11px]">(x {item.qty})</span>
                  <span className="font-bold text-amber-500 text-xs w-16">{item.subtotal}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Taxas e Total Final */}
          <div className="border-t border-white/5 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-end gap-6 text-neutral-300">
              <span className="text-neutral-400">Taxa de rede</span>
              <span className="font-bold text-neutral-200 w-20 text-right">{transactionData.networkFee}</span>
            </div>
            <div className="flex justify-end gap-6 text-xs">
              <span className="font-bold text-white">Total</span>
              <span className="font-extrabold text-amber-500 w-20 text-right">{transactionData.total}</span>
            </div>
          </div>
        </div>

        {/* 4. Notificação de Confirmação na Ethereum */}
        <p className="text-[11px] text-neutral-400 text-center leading-relaxed max-w-sm mx-auto">
          Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.
        </p>

        {/* 5. Botão Ver no Etherscan */}
        <div className="flex justify-center pt-1 pb-2">
          <button
            type="button"
            onClick={() => alert('Redirecionando para o simulador do Etherscan (0xA91F...E02C)')}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md"
          >
            <span>Ver no Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}

export default OrderConfirmationPage;