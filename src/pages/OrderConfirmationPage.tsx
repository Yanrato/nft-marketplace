import { Link } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { CreatedOrder } from "@/features/checkout/api";

const LAST_ORDER_KEY = "kurio_last_order";

function readLastOrder(): CreatedOrder | null {
  try {
    const stored = localStorage.getItem(LAST_ORDER_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("id" in parsed) ||
      !("createdAt" in parsed) ||
      !("items" in parsed) ||
      !("subtotal" in parsed) ||
      !("discount" in parsed) ||
      !("networkFee" in parsed) ||
      !("total" in parsed) ||
      !("customer" in parsed) ||
      !Array.isArray(parsed.items)
    ) {
      return null;
    }

    return parsed as CreatedOrder;
  } catch {
    return null;
  }
}

function formatEth(value: string | number): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "— ETH";
  }

  return `${amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 6,
  })} ETH`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return date.toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrderConfirmationPage() {
  const [order] = useState<CreatedOrder | null>(() => readLastOrder());

  if (!order) {
    return (
      <main className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 py-16 text-center font-mono text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <ShoppingBag className="h-7 w-7 text-amber-500" />
        </div>

        <h1 className="text-lg font-bold">Nenhum pedido encontrado</h1>

        <p className="max-w-md text-xs leading-6 text-neutral-400">
          Não encontramos os dados de uma compra recente neste navegador.
          Você pode voltar à loja para continuar explorando os NFTs.
        </p>

        <Link
          to="/"
          className="rounded-lg bg-amber-600 px-5 py-3 text-xs font-bold text-neutral-950 transition-colors hover:bg-amber-500"
        >
          Explorar NFTs
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full items-center justify-center px-4 py-8 font-mono text-white sm:px-6">
      <section className="relative flex w-full max-w-2xl flex-col gap-6 overflow-hidden rounded-2xl border border-amber-900/30 bg-[#19100B] p-5 shadow-2xl sm:p-8">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />

        <Link
          to="/"
          aria-label="Voltar para a página inicial"
          className="absolute right-4 top-4 rounded p-1 text-neutral-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </Link>

        <header className="flex flex-col items-center gap-3 pt-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10">
            <CheckCircle2 className="h-9 w-9 text-amber-500" />
          </div>

          <h1 className="text-lg font-bold">Pedido confirmado!</h1>

          <p className="max-w-md text-xs leading-6 text-neutral-300">
            Seu pedido foi registrado com sucesso. Confira abaixo os
            detalhes da compra.
          </p>

          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Pedido {order.status === "confirmed" ? "confirmado" : order.status}
          </span>
        </header>

        <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-[10px] sm:grid-cols-4">
          <div className="min-w-0">
            <span className="mb-1 block text-neutral-400">ID do pedido</span>
            <strong className="block break-all text-neutral-200">
              {order.id}
            </strong>
          </div>

          <div className="min-w-0">
            <span className="mb-1 block text-neutral-400">Data</span>
            <strong className="block text-neutral-200">
              {formatDate(order.createdAt)}
            </strong>
          </div>

          <div className="min-w-0">
            <span className="mb-1 block text-neutral-400">Rede</span>
            <strong className="block text-neutral-200">
              {order.customer.network}
            </strong>
          </div>

          <div className="min-w-0">
            <span className="mb-1 block text-neutral-400">Carteira</span>
            <strong className="block break-words text-neutral-200">
              {order.customer.walletType}
            </strong>
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold tracking-wide">
            Detalhes do pedido
          </h2>

          <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-neutral-400">
            <span>NFT</span>
            <div className="flex gap-5">
              <span>Qtd.</span>
              <span className="w-24 text-right">Subtotal</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-11 w-11 shrink-0 rounded-lg border border-white/10 bg-neutral-900 object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-[11px] font-bold">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-neutral-400">
                      Token: {item.tokenId}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Edição {item.edition}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <span className="text-[11px] text-neutral-400">
                    {item.quantity}
                  </span>

                  <span className="w-24 text-right text-xs font-bold text-amber-500">
                    {formatEth(Number(item.price) * item.quantity)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-white/10 pt-4 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Subtotal</span>
            <span>{formatEth(order.subtotal)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Desconto</span>
            <span>{formatEth(order.discount)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Taxa de rede</span>
            <span>{formatEth(order.networkFee)}</span>
          </div>

          <div className="flex justify-between gap-4 border-t border-white/10 pt-4 text-sm font-bold">
            <span>Total</span>
            <span className="text-amber-500">
              {formatEth(order.total)}
            </span>
          </div>
        </section>

        <p className="text-center text-[10px] leading-5 text-neutral-400">
          Esta é uma confirmação do pedido de demonstração. Nenhuma
          transação real na blockchain é comprovada por esta tela.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 text-xs font-bold text-neutral-950 transition-colors hover:bg-amber-500"
          >
            Continuar explorando
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmationPage;