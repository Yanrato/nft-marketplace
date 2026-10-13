import { NFTDescription } from "@/components/layout/nft/NFTDescription";
import { RelatedProducts } from "@/components/layout/nft/NFTRelatedProducts";
import { NFTTopSection } from "@/components/layout/nft/NFTTopSection";


export function NFTDetailsPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-col gap-16 w-full font-mono">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <a href="/" className="hover:text-white transition-colors">Início</a>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Mercado</span>
      </nav>

      {/* 2. Top: Galeria + Caixa de Compra */}
      <NFTTopSection />

      {/* 3. Description: Abas de especificações e contrato */}
      <NFTDescription />

      {/* 4. Related Products: Mais desta coleção */}
      <RelatedProducts />
    </main>
  );
}

export default NFTDetailsPage;