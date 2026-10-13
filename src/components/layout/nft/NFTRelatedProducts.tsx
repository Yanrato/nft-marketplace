import { ProductCard, type NFTItem } from '@/components/layout/products/ProductCard';

const relatedNFTs: NFTItem[] = [
  { id: 'rel-1', name: 'Cosmic Bloom #118', price: '1.29', imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
  { id: 'rel-2', name: 'Violet Nomad #314', price: '1.39', imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop' },
  { id: 'rel-3', name: 'Ivory Baron #088', price: '1.79', imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop' },
  { id: 'rel-4', name: 'Golden Beat #207', price: '0.99', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
  { id: 'rel-5', name: 'Golden Signal #160', price: '0.39', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
];

export function RelatedProducts() {
  return (
    <section className="border-t border-white/10 pt-10 pb-8 space-y-6 font-mono">
      <h2 className="text-sm font-bold text-neutral-200">
        Mais desta coleção
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {relatedNFTs.map((nft) => (
          <ProductCard key={nft.id} nft={nft} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-1.5 pt-4">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="w-2 h-2 rounded-full bg-amber-500/40" />
        <span className="w-2 h-2 rounded-full bg-amber-500/40" />
      </div>
    </section>
  );
}