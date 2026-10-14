import { useState } from "react";
import type { NFT } from "@/contracts/nft";

interface NFTDescriptionProps {
  nft: NFT;
}

export function NFTDescription({ nft }: NFTDescriptionProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">(
    "details"
  );

  return (
    <section className="border-t border-white/10 pt-8 font-mono">
      <div className="flex items-center gap-8 border-b border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={`pb-3 ${
            activeTab === "details"
              ? "border-b-2 border-amber-500 font-bold text-amber-500"
              : "text-neutral-400"
          }`}
        >
          Detalhes do NFT
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 ${
            activeTab === "reviews"
              ? "border-b-2 border-amber-500 font-bold text-amber-500"
              : "text-neutral-400"
          }`}
        >
          Avaliações ({nft.reviewsCount})
        </button>
      </div>

      <div className="max-w-4xl space-y-4 py-6 text-xs leading-relaxed text-neutral-400">
        {activeTab === "details" ? (
          <>
            <p>{nft.description}</p>

            <p>
              <strong className="text-neutral-200">Coleção: </strong>
              {nft.collection}
            </p>

            <p>
              <strong className="text-neutral-200">Categoria: </strong>
              {nft.category}
            </p>

            <p>
              <strong className="text-neutral-200">Rede: </strong>
              {nft.network}
            </p>

            <p>
              <strong className="text-neutral-200">
                Edições disponíveis:{" "}
              </strong>
              {nft.availableEditions} de {nft.totalEditions}
            </p>

            <p>
              <strong className="text-neutral-200">Contrato: </strong>
              <code className="text-amber-500">
                {nft.contractAddress}
              </code>
            </p>

            <p>
              <strong className="text-neutral-200">
                Taxa do criador:{" "}
              </strong>
              {nft.creatorFee}
            </p>
          </>
        ) : (
          <p>
            {nft.reviewsCount > 0
              ? `${nft.reviewsCount} avaliações registradas para este NFT.`
              : "Este NFT ainda não possui avaliações."}
          </p>
        )}
      </div>
    </section>
  );
}

export default NFTDescription;
