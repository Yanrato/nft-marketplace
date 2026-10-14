import { useEffect, useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ProductCard,
  type NFTItem,
} from "../components/layout/products/ProductCard";
import { useCart } from "@/features/cart/useCart";
import { getOrderQuote } from "@/features/checkout/api";

const recommendedNFTs: NFTItem[] = [
  {
    id: "rec-1",
    name: "Cosmic Bloom #118",
    price: "1.29",
    imageUrl:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "rec-2",
    name: "Violet Nomad #314",
    price: "1.39",
    imageUrl:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "rec-3",
    name: "Ivory Baron #088",
    price: "1.79",
    imageUrl:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "rec-4",
    name: "Golden Beat #207",
    price: "0.99",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "rec-5",
    name: "Golden Signal #160",
    price: "0.39",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  },
];

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCart();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(
    () => localStorage.getItem("kurio_coupon") ?? ""
  );
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const networkFee = items.length > 0 ? 0.016 : 0;

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const total = Math.max(0, subtotal - discount) + networkFee;

  useEffect(() => {
    let cancelled = false;

    if (items.length === 0) {
      setDiscount(0);
      return;
    }

    getOrderQuote({
      items,
      couponCode: appliedCoupon || undefined,
    })
      .then((quote) => {
        if (!cancelled) {
          setDiscount(Number(quote.discount));
          setCouponMessage(
            appliedCoupon ? `Cupom ${appliedCoupon} aplicado.` : ""
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDiscount(0);

          if (appliedCoupon) {
            setCouponMessage(
              "Não foi possível validar o cupom ou a cotação."
            );
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [items, appliedCoupon]);

  const handleApplyCoupon = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const code = coupon.trim().toUpperCase();

    if (!code) {
      setCouponMessage("Digite um código promocional.");
      return;
    }

    try {
      const quote = await getOrderQuote({
        items,
        couponCode: code,
      });

      localStorage.setItem("kurio_coupon", code);
      setAppliedCoupon(code);
      setDiscount(Number(quote.discount));
      setCouponMessage(
        `Cupom ${code} aplicado: desconto de ${Number(
          quote.discount
        ).toFixed(3)} ETH.`
      );
    } catch (error: unknown) {
      localStorage.removeItem("kurio_coupon");
      setAppliedCoupon("");
      setDiscount(0);

      const message =
        error &&
          typeof error === "object" &&
          "response" in error
          ? (
            error as {
              response?: {
                data?: { message?: string };
              };
            }
          ).response?.data?.message
          : undefined;

      setCouponMessage(message ?? "Cupom inválido ou expirado.");
    }
  };

  const handleRemoveCoupon = () => {
    localStorage.removeItem("kurio_coupon");
    setAppliedCoupon("");
    setCoupon("");
    setDiscount(0);
    setCouponMessage("Cupom removido.");
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 py-8 font-mono md:px-12 lg:px-24">
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <Link to="/" className="transition-colors hover:text-white">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Carrinho</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="hidden grid-cols-12 border-b border-white/10 px-4 pb-3 text-xs font-bold text-neutral-400 sm:grid">
            <span className="col-span-5">NFTs</span>
            <span className="col-span-2 text-center">Preço</span>
            <span className="col-span-2 text-center">Edições</span>
            <span className="col-span-2 text-center">Total</span>
            <span className="col-span-1" />
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-white/10 py-16 text-center">
              <p className="text-sm text-neutral-300">
                Seu carrinho está vazio.
              </p>
              <Link
                to="/"
                className="rounded-md bg-amber-600 px-5 py-3 text-xs font-bold text-black transition-colors hover:bg-amber-500"
              >
                Explorar NFTs
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.nftId}-${item.edition}`}
                className="grid grid-cols-1 items-center gap-4 rounded-lg border border-white/10 p-4 sm:grid-cols-12"
              >
                <div className="flex items-center gap-4 sm:col-span-5">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-neutral-100">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Edição: {item.edition}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-neutral-300 sm:col-span-2 sm:text-center">
                  <span className="sm:hidden">Preço: </span>
                  {Number(item.price).toFixed(3)} ETH
                </div>

                <div className="flex items-center gap-3 sm:col-span-2 sm:justify-center">
                  <button
                    type="button"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    onClick={() =>
                      updateQuantity(
                        item.nftId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="rounded border border-white/10 p-1 text-neutral-300 disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-4 text-center text-xs text-neutral-200">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    onClick={() =>
                      updateQuantity(
                        item.nftId,
                        item.quantity + 1
                      )
                    }
                    className="rounded border border-white/10 p-1 text-neutral-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-xs text-neutral-200 sm:col-span-2 sm:text-center">
                  <span className="sm:hidden">Total: </span>
                  {(Number(item.price) * item.quantity).toFixed(3)} ETH
                </div>

                <div className="flex justify-end sm:col-span-1">
                  <button
                    type="button"
                    aria-label={`Remover ${item.name} do carrinho`}
                    onClick={() => removeItem(item.nftId)}
                    className="rounded p-2 text-neutral-400 transition-colors hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="flex flex-col gap-6 rounded-lg border border-white/10 p-5 lg:col-span-4">
          <h2 className="text-sm font-bold text-neutral-100">
            Resumo do pedido
          </h2>

          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Subtotal</span>
            <span className="text-neutral-200">
              {subtotal.toFixed(3)} ETH
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Desconto</span>
            <span className="text-emerald-400">
              -{discount.toFixed(3)} ETH
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Taxa de rede</span>
            <span className="text-neutral-200">
              {networkFee.toFixed(3)} ETH
            </span>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-4 text-sm font-bold">
            <span className="text-neutral-100">Total</span>
            <span className="text-amber-400">{total.toFixed(3)} ETH</span>
          </div>

          <form onSubmit={handleApplyCoupon} className="flex flex-col gap-3">
            <label
              htmlFor="coupon"
              className="text-xs font-bold text-neutral-300"
            >
              Código promocional
            </label>

            <div className="flex gap-2">
              <input
                id="coupon"
                name="coupon"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Digite seu cupom"
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-[#1A110B] px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
              />

              <button
                type="submit"
                disabled={items.length === 0}
                className="rounded-md border border-amber-600 px-3 py-2 text-xs text-amber-400 transition-colors hover:bg-amber-600/10 disabled:opacity-40"
              >
                Aplicar
              </button>
            </div>

            {couponMessage && (
              <p
                role="status"
                className="text-xs text-neutral-300"
              >
                {couponMessage}
              </p>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400">
                  Cupom ativo: {appliedCoupon}
                </span>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-neutral-400 underline hover:text-white"
                >
                  Remover
                </button>
              </div>
            )}
          </form>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate({ to: "/checkout" })}
            className="rounded-md bg-amber-600 px-5 py-3 text-xs font-bold text-black transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar para pagamento
          </button>

          <Link
            to="/"
            className="text-center text-xs text-neutral-400 underline transition-colors hover:text-white"
          >
            Continuar comprando
          </Link>
        </aside>
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-amber-500">
              Descubra mais
            </p>
            <h2 className="text-xl font-bold text-neutral-100">
              Você também pode gostar
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {recommendedNFTs.map((nft) => (
            <ProductCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>
    </main>
  );
}