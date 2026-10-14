import { useState } from "react";
import { Star, Minus, Plus, Heart, ZoomIn, Mail } from "lucide-react";
import type { NFT } from "@/contracts/nft";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/features/cart/CartContext";

interface NFTTopSectionProps {
  nft: NFT;
}

export function NFTTopSection({ nft }: NFTTopSectionProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState(
    nft.editions[0] ?? "Única"
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { addItem } = useCart();
  const navigate = useNavigate();

  const galleryImages = [nft.imageUrl];
  const editions = nft.editions;

  const currentImage =
    galleryImages[selectedImage] ?? nft.imageUrl;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
      {/* Galeria de Fotos */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        {/* Miniaturas */}
        <div className="flex sm:flex-col gap-3 shrink-0">
          {galleryImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setSelectedImage(idx)}
              aria-label={`Selecionar imagem ${idx + 1}`}
              aria-pressed={selectedImage === idx}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-900 border transition-all ${selectedImage === idx
                ? "border-amber-500 scale-95 shadow-md"
                : "border-white/10 hover:border-white/30"
                }`}
            >
              <img
                src={img}
                alt={`${nft.name} - imagem ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Imagem Principal */}
        <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl">
          <img
            src={currentImage}
            alt={nft.name}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            aria-label="Ampliar imagem"
            onClick={() => window.open(currentImage, "_blank", "noopener,noreferrer")}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-neutral-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Informações e Compra */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Título e preço */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {nft.name}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xl font-extrabold text-amber-500">
              {nft.price} ETH
            </span>

            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <div className="flex text-amber-500" aria-label="Avaliação">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current"
                  />
                ))}
              </div>

              <span className="text-[11px]">
                {nft.reviewsCount} avaliações de colecionadores
              </span>
            </div>
          </div>
        </div>

        {/* Sobre */}
        <div className="space-y-1.5 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
          <span className="text-neutral-200 font-bold block">
            Sobre este NFT:
          </span>

          <p>{nft.description}</p>
        </div>

        {/* Edições */}
        <div className="space-y-2">
          <span className="text-xs text-neutral-200 font-bold block">
            Edição:
          </span>

          <div className="flex flex-wrap gap-2 text-xs">
            {editions.map((edition) => (
              <button
                key={edition}
                type="button"
                onClick={() => setSelectedEdition(edition)}
                aria-pressed={selectedEdition === edition}
                className={`px-3 py-1.5 rounded-full border transition-colors ${selectedEdition === edition
                  ? "border-amber-500 text-amber-500 bg-amber-500/10 font-bold"
                  : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                  }`}
              >
                {edition}
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade e Compra */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center bg-[#1E130D] border border-white/10 rounded-lg p-1">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
              className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 text-xs font-bold text-white">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((current) => current + 1)}
              className="p-1.5 text-neutral-400 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              addItem(nft, quantity, selectedEdition);
              navigate({ to: "/carrinho" });
            }}
          className="flex-1 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider transition-colors shadow-md"
          >
          COMPRAR
        </button>

        <button
          type="button"
          onClick={() => setIsFavorite((current) => !current)}
          aria-pressed={isFavorite}
          className={`p-3 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${isFavorite
            ? "border-amber-500 text-amber-500 bg-amber-500/10"
            : "border-white/15 text-neutral-300 hover:border-amber-500 hover:text-white"
            }`}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "fill-current" : ""
              }`}
          />
          <span>Favoritar</span>
        </button>
      </div>

      {/* Metadados Técnicos */}
      <div className="space-y-1.5 text-xs text-neutral-400 border-t border-white/5 pt-4">
        <p>
          <strong className="text-neutral-300">ID do token:</strong>{" "}
          #{nft.tokenId}
        </p>

        <p>
          <strong className="text-neutral-300">Coleção:</strong>{" "}
          {nft.collection}
        </p>

        <p>
          <strong className="text-neutral-300">Categoria:</strong>{" "}
          {nft.category}
        </p>

        <p>
          <strong className="text-neutral-300">Rede:</strong>{" "}
          {nft.network}
        </p>

        <p>
          <strong className="text-neutral-300">Contrato:</strong>{" "}
          {nft.contractAddress}
        </p>

        <div className="flex items-center gap-2 pt-2 text-xs">
          <span className="text-neutral-300">
            Compartilhar este NFT:
          </span>

          <button
            type="button"
            aria-label="Compartilhar NFT por e-mail"
            onClick={() => {
              const subject = encodeURIComponent(nft.name);
              const body = encodeURIComponent(
                `Confira este NFT: ${window.location.href}`
              );

              window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }}
            className="text-neutral-400 hover:text-white"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </section >
  );
}

export default NFTTopSection;