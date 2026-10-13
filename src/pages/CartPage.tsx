import { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ProductCard, type NFTItem } from '../components/layout/products/ProductCard';

interface CartItem {
  id: string;
  name: string;
  tokenId: string;
  price: number; // Ex: 1.19
  quantity: number;
  imageUrl: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Emerald Ape #042',
    tokenId: '#0042',
    price: 1.19,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cart-2',
    name: 'Violet Nomad #314',
    tokenId: '#0009',
    price: 1.39,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cart-3',
    name: 'Ivory Baron #088',
    tokenId: '#0552',
    price: 1.79,
    quantity: 9,
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=300&auto=format&fit=crop',
  },
];

const recommendedNFTs: NFTItem[] = [
  { id: 'rec-1', name: 'Cosmic Bloom #118', price: '1.29', imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
  { id: 'rec-2', name: 'Violet Nomad #314', price: '1.39', imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
  { id: 'rec-3', name: 'Ivory Baron #088', price: '1.79', imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop' },
  { id: 'rec-4', name: 'Golden Beat #207', price: '0.99', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
  { id: 'rec-5', name: 'Golden Signal #160', price: '0.39', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
];

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const networkFee = 0.016; // Taxa estimada em ETH

  // Atualizar quantidade
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remover item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Cálculos com precisão decimal
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = items.length > 0 ? subtotal - discount + networkFee : 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'KURIO10') {
      setDiscount(subtotal * 0.1);
      alert('Cupom KURIO10 aplicado: 10% de desconto!');
    } else {
      alert('Cupom inválido ou expirado.');
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-col gap-16 w-full font-mono">
      
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <a href="/" className="hover:text-white transition-colors">Início</a>
        <span className="mx-2">/</span>
        <a href="#mercado" className="hover:text-white transition-colors">Mercado</a>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Carrinho</span>
      </nav>

      {/* 2. Seção Principal: Itens do Carrinho + Resumo da Carteira */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Coluna da Esquerda: Tabela de Itens (8 colunas) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Cabeçalho da Tabela (Desktop) */}
          <div className="hidden sm:grid sm:grid-cols-12 text-xs text-neutral-400 font-bold border-b border-white/10 pb-3 px-4">
            <span className="col-span-5">NFTs</span>
            <span className="col-span-2 text-center">Preço</span>
            <span className="col-span-2 text-center">Edições</span>
            <span className="col-span-2 text-center">Total</span>
            <span className="col-span-1"></span>
          </div>

          {/* Lista de Itens */}
          {items.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs bg-[#1C120C] rounded-2xl border border-white/5">
              Seu carrinho está vazio.
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(2);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#1C120C] border border-white/5 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 text-xs transition-colors hover:border-amber-900/30"
                >
                  {/* NFT: Imagem + Nome + TokenID */}
                  <div className="col-span-5 flex items-center gap-3 w-full">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/5">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col truncate">
                      <h3 className="font-bold text-white text-xs truncate">{item.name}</h3>
                      <span className="text-[11px] text-neutral-400">ID do token: {item.tokenId}</span>
                    </div>
                  </div>

                  {/* Preço Unitário */}
                  <div className="col-span-2 text-center text-neutral-200">
                    <span className="sm:hidden text-neutral-400 mr-2">Preço:</span>
                    {item.price.toFixed(2)} ETH
                  </div>

                  {/* Controle de Edições (Quantidade) */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label="Diminuir"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-full bg-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-black flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white px-1">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Aumentar"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-full bg-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-black flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Total do Item */}
                  <div className="col-span-2 text-center text-amber-500 font-bold">
                    <span className="sm:hidden text-neutral-400 mr-2">Total:</span>
                    {itemTotal} ETH
                  </div>

                  {/* Botão de Excluir */}
                  <div className="col-span-1 flex justify-end w-full sm:w-auto">
                    <button
                      type="button"
                      aria-label={`Remover ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coluna da Direita: Resumo da Carteira (4 colunas) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Resumo da carteira
          </h2>

          {/* Cupom Promocional */}
          <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
            <label className="text-[11px] text-neutral-400">Código promocional</label>
            <div className="flex">
              <input
                type="text"
                placeholder="Digite o código promocional..."
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="bg-[#241710] border border-white/5 rounded-l-md px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 outline-none w-full focus:border-amber-600 transition-colors"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-4 py-2 rounded-r-md transition-colors shrink-0"
              >
                Aplicar
              </button>
            </div>
          </form>

          {/* Linhas de Valores Financeiros */}
          <div className="space-y-3 pt-2 text-xs border-t border-white/5">
            <div className="flex justify-between items-center text-neutral-300">
              <span>Subtotal</span>
              <span className="font-bold text-white">{subtotal.toFixed(2)} ETH</span>
            </div>

            <div className="flex justify-between items-center text-neutral-300">
              <span>Desconto do lançamento</span>
              <span className="text-neutral-400">(-) {discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-start text-neutral-300">
              <div className="flex flex-col">
                <span>Taxa de rede</span>
                <span className="text-[10px] text-amber-600/80">Taxa estimada</span>
              </div>
              <span className="font-bold text-neutral-200">{networkFee.toFixed(3)} ETH</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-base font-extrabold text-amber-500">
                {total.toFixed(3)} ETH
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/checkout' })}
              disabled={items.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-neutral-950 font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
            >
              Conectar e finalizar
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="text-xs text-neutral-400 hover:text-white transition-colors text-center py-1"
            >
              Continuar explorando
            </button>
          </div>

        </div>

      </div>

      {/* 3. Seção Inferior: Colecionadores também viram */}
      <section className="border-t border-white/10 pt-10 pb-8 space-y-6">
        <h2 className="text-xs font-bold text-amber-500 tracking-wide">
          Colecionadores também viram
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recommendedNFTs.map((nft) => (
            <ProductCard key={nft.id} nft={nft} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-1.5 pt-4">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="w-2 h-2 rounded-full bg-amber-500/40" />
          <span className="w-2 h-2 rounded-full bg-amber-500/40" />
        </div>
      </section>

    </main>
  );
}

export default CartPage;