
import { Link, useParams } from "@tanstack/react-router";
import { useNFT } from "@/hooks/useNFTs";
import { NFTTopSection } from "@/components/layout/nft/NFTTopSection";
import { NFTDescription } from "@/components/layout/nft/NFTDescription";
import { RelatedProducts } from "@/components/layout/nft/NFTRelatedProducts";

export function NFTDetailsPage() {
  const { id } = useParams({ from: "/nft/$id" });
  const { data: nft, isPending, isError } = useNFT(id);

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-6 py-12 text-white">
        <p role="status">Carregando detalhes do NFT...</p>
      </main>
    );
  }

  if (isError || !nft) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-6 py-12 text-white">
        <h1 className="text-xl font-bold">Não foi possível carregar o NFT</h1>
        <p className="mt-2 text-neutral-400">
          O NFT pode não existir ou ocorreu um erro na consulta.
        </p>
        <Link to="/" className="mt-4 inline-block text-amber-500">
          Voltar ao catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-8 font-mono md:px-12 lg:px-24">
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <Link to="/" className="hover:text-white">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span>Mercado</span>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">{nft.name}</span>
      </nav>

      <NFTTopSection nft={nft} />

      <NFTDescription nft={nft} />

      <RelatedProducts />
    </main>
  );
}

export default NFTDetailsPage;
