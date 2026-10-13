import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function CheckoutPage() {
  const navigate = useNavigate();
  // Formulário do Colecionador
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    network: 'Ethereum',
    profileName: '',
    walletAddress: '',
    secondaryWallet: '',
    walletType: 'Coinbase',
    referralCode: '',
    email: '',
    ensName: '',
    useOtherWallet: false,
    notes: '',
  });

  const [selectedWallet, setSelectedWallet] = useState<'multi' | 'metamask' | 'coinbase'>('coinbase');

  const purchasedNFTs = [
    {
      name: 'Emerald Ape #042',
      tokenId: '#0042',
      qty: 2,
      totalPrice: '2.38 ETH',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Violet Nomad #314',
      tokenId: '#0314',
      qty: 6,
      totalPrice: '8.34 ETH',
      imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop',
    },
    {
      name: 'Ivory Baron #088',
      tokenId: '#0088',
      qty: 9,
      totalPrice: '16.11 ETH',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=200&auto=format&fit=crop',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: '/confirmacao' });
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-col gap-12 w-full font-mono text-white">
      
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <a href="/" className="hover:text-white transition-colors">Início</a>
        <span className="mx-2">/</span>
        <a href="#mercado" className="hover:text-white transition-colors">Mercado</a>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Pagamento</span>
      </nav>

      {/* 2. Formulário e Resumo */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Coluna da Esquerda: Perfil do Colecionador (7 Colunas) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Perfil do colecionador
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Nome de exibição */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Nome de exibição<span className="text-amber-500">*</span></label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* Nome de usuário */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Nome de usuário<span className="text-amber-500">*</span></label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* Rede */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Rede <span className="text-amber-500">*</span></label>
              <div className="relative">
                <select
                  value={formData.network}
                  onChange={e => setFormData({ ...formData, network: e.target.value })}
                  className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-300 outline-none appearance-none cursor-pointer focus:border-amber-600"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Solana">Solana</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Nome do perfil */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Nome do perfil<span className="text-amber-500">*</span></label>
              <input
                type="text"
                required
                value={formData.profileName}
                onChange={e => setFormData({ ...formData, profileName: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* Endereço da carteira */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Endereço da carteira<span className="text-amber-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Endereço 0x da carteira"
                value={formData.walletAddress}
                onChange={e => setFormData({ ...formData, walletAddress: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600"
              />
            </div>

            {/* ENS ou carteira secundária */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">ENS ou carteira secundária (opcional)</label>
              <input
                type="text"
                value={formData.secondaryWallet}
                onChange={e => setFormData({ ...formData, secondaryWallet: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* Tipo de carteira */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Tipo de carteira<span className="text-amber-500">*</span></label>
              <div className="relative">
                <select
                  value={formData.walletType}
                  onChange={e => setFormData({ ...formData, walletType: e.target.value })}
                  className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-300 outline-none appearance-none cursor-pointer focus:border-amber-600"
                >
                  <option value="Coinbase">Coinbase Wallet</option>
                  <option value="MetaMask">MetaMask</option>
                  <option value="WalletConnect">WalletConnect</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Código de indicação */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Código de indicação<span className="text-amber-500">*</span></label>
              <input
                type="text"
                required
                value={formData.referralCode}
                onChange={e => setFormData({ ...formData, referralCode: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">E-mail<span className="text-amber-500">*</span></label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />
            </div>

            {/* Nome ENS */}
            <div className="space-y-1.5">
              <label className="text-neutral-300">Nome ENS <span className="text-amber-500">*</span></label>
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="seu-nome"
                  value={formData.ensName}
                  onChange={e => setFormData({ ...formData, ensName: e.target.value })}
                  className="w-full bg-[#1A110B] border border-white/10 rounded-l-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                />
                <span className="bg-[#241710] border border-l-0 border-white/10 px-3 py-2.5 text-xs text-neutral-400 rounded-r-md flex items-center">
                  .eth
                </span>
              </div>
            </div>

          </div>

          {/* Opção Usar outra carteira */}
          <div className="flex items-center gap-2 pt-2 text-xs text-neutral-300">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, useOtherWallet: !formData.useOtherWallet })}
              className={`w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center ${
                formData.useOtherWallet ? 'border-amber-500 bg-amber-500' : 'border-amber-600'
              }`}
            >
              {formData.useOtherWallet && <Check className="w-2.5 h-2.5 text-black" />}
            </button>
            <span>Usar outra carteira?</span>
          </div>

          {/* Observação do colecionador */}
          <div className="space-y-1.5 pt-2 text-xs">
            <label className="text-neutral-300">Observação do colecionador (opcional)</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#1A110B] border border-white/10 rounded-md p-3 text-xs text-neutral-200 outline-none focus:border-amber-600 resize-none"
            />
          </div>

        </div>

        {/* Coluna da Direita: Seus NFTs + Resumo + Seleção de Carteira (5 Colunas) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Seus NFTs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-neutral-400 font-bold border-b border-white/10 pb-2">
              <span>Seus NFTs</span>
              <span>Subtotal</span>
            </div>

            <div className="space-y-3">
              {purchasedNFTs.map((nft, i) => (
                <div key={i} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                      <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-[11px] leading-snug">{nft.name}</p>
                      <span className="text-[10px] text-neutral-400">ID do token: {nft.tokenId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 text-[10px] mr-2">(x {nft.qty})</span>
                    <span className="font-bold text-amber-500">{nft.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cupom Link */}
          <div className="text-right text-[11px] text-neutral-400 hover:text-amber-500 cursor-pointer transition-colors">
            Tem um código promocional? Aplique aqui
          </div>

          {/* Valores Financeiros */}
          <div className="space-y-2.5 text-xs border-t border-white/5 pt-3">
            <div className="flex justify-between text-neutral-300">
              <span>Subtotal</span>
              <span className="font-bold text-white">26.83 ETH</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Desconto do lançamento</span>
              <span className="text-neutral-400">(-) 00.00</span>
            </div>
            <div className="flex justify-between items-start text-neutral-300">
              <div className="flex flex-col">
                <span>Taxa de rede</span>
                <span className="text-[10px] text-amber-600/80">Taxa estimada</span>
              </div>
              <span className="font-bold text-neutral-200">0.016 ETH</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-base font-extrabold text-amber-500">26.846 ETH</span>
            </div>
          </div>

          {/* Carteira e Rede (Seletor) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-neutral-200">Carteira e rede</h3>
            
            <div className="space-y-2">
              {/* Opção 1: Multi-carteiras */}
              <label 
                onClick={() => setSelectedWallet('multi')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  selectedWallet === 'multi' ? 'border-amber-600/60 bg-[#1F140D]' : 'border-white/10 bg-[#160E0A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedWallet === 'multi' ? 'border-amber-500' : 'border-neutral-500'}`}>
                    {selectedWallet === 'multi' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </span>
                  <div className="inline-block bg-[#241710] border border-amber-900/40 px-2 py-0.5 rounded text-[9px] text-amber-500 font-bold">
                    METAMASK &nbsp;•&nbsp; WALLETCONNECT &nbsp;•&nbsp; COINBASE
                  </div>
                </div>
              </label>

              {/* Opção 2: MetaMask */}
              <label 
                onClick={() => setSelectedWallet('metamask')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  selectedWallet === 'metamask' ? 'border-amber-600/60 bg-[#1F140D]' : 'border-white/10 bg-[#160E0A]'
                }`}
              >
                <div className="flex items-center gap-3 text-xs text-neutral-300">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedWallet === 'metamask' ? 'border-amber-500' : 'border-neutral-500'}`}>
                    {selectedWallet === 'metamask' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </span>
                  <span>MetaMask</span>
                </div>
              </label>

              {/* Opção 3: Coinbase Wallet (Selecionada) */}
              <label 
                onClick={() => setSelectedWallet('coinbase')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                  selectedWallet === 'coinbase' ? 'border-amber-600/60 bg-[#1F140D]' : 'border-white/10 bg-[#160E0A]'
                }`}
              >
                <div className="flex items-center gap-3 text-xs text-neutral-300">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedWallet === 'coinbase' ? 'border-amber-500' : 'border-neutral-500'}`}>
                    {selectedWallet === 'coinbase' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </span>
                  <span>Coinbase Wallet</span>
                </div>
              </label>
            </div>
          </div>

          {/* Botão Confirmar Compra */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Confirmar compra
            </button>
          </div>

        </div>

      </form>
    </main>
  );
}

export default CheckoutPage;