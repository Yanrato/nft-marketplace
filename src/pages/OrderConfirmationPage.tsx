
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getOrderStatus,
  type CreatedOrder,
  type OrderStatus,
} from "@/features/checkout/api";

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
      !("status" in parsed) ||
      !Array.isArray(parsed.items) ||
      !["pending", "confirmed", "rejected"].includes(String(parsed.status))
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

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pendente";
    case "confirmed":
      return "Confirmado";
    case "rejected":
      return "Rejeitado";
  }
}

function getStatusTitle(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Aguardando confirmação";
    case "confirmed":
      return "Pedido confirmado!";
    case "rejected":
      return "Pedido não concluído";
  }
}

function getStatusDescription(order: CreatedOrder): string {
  if (order.statusMessage) {
    return order.statusMessage;
  }

  switch (order.status) {
    case "pending":
      return "Estamos processando seu pedido. Esta página será atualizada quando houver uma resposta.";
    case "confirmed":
      return "Seu pedido foi registrado com sucesso. Confira abaixo os detalhes da compra.";
    case "rejected":
      return "Não foi possível concluir sua compra. Confira os detalhes abaixo.";
  }
}

export function OrderConfirmationPage() {
  const [order, setOrder] = useState<CreatedOrder | null>(() =>
    readLastOrder()
  );
  const [statusCheckError, setStatusCheckError] = useState(false);

  const orderId = order?.id;
  const orderStatus = order?.status;

  useEffect(() => {
    if (!orderId || orderStatus !== "pending") {
  return;
}

const currentOrderId = orderId;

let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function checkStatus() {
      try {
        const updatedOrder = await getOrderStatus(currentOrderId);

        if (cancelled) {
          return;
        }

        setOrder(updatedOrder);
        setStatusCheckError(false);

        localStorage.setItem(
          LAST_ORDER_KEY,
          JSON.stringify(updatedOrder)
        );

        if (updatedOrder.status === "pending") {
          timeoutId = setTimeout(checkStatus, 1200);
        }
      } catch {
        if (cancelled) {
          return;
        }

        setStatusCheckError(true);
        timeoutId = setTimeout(checkStatus, 2500);
      }
    }

    timeoutId = setTimeout(checkStatus, 500);

    return () => {
      cancelled = true;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderId, orderStatus]);

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

  const isPending = order.status === "pending";
  const isConfirmed = order.status === "confirmed";
  const isRejected = order.status === "rejected";

  const statusBorderClass = isPending
    ? "border-sky-500/40 bg-sky-500/10"
    : isConfirmed
      ? "border-amber-500/40 bg-amber-500/10"
      : "border-red-500/40 bg-red-500/10";

  const statusIconClass = isPending
    ? "text-sky-400"
    : isConfirmed
      ? "text-amber-500"
      : "text-red-400";

  const statusLabelClass = isPending
    ? "border-sky-500/30 bg-sky-500/10 text-sky-300"
    : isConfirmed
      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
      : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <main className="flex w-full items-center justify-center px-4 py-8 font-mono text-white sm:px-6">
      <section className="relative flex w-full max-w-2xl flex-col gap-6 overflow-hidden rounded-2xl border border-amber-900/30 bg-[#19100B] p-5 shadow-2xl sm:p-8">
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            isPending
              ? "bg-sky-500"
              : isConfirmed
                ? "bg-amber-600"
                : "bg-red-500"
          }`}
        />

        <Link
          to="/"
          aria-label="Voltar para a página inicial"
          className="absolute right-4 top-4 rounded p-1 text-neutral-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </Link>

        <header className="flex flex-col items-center gap-3 pt-3 text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${statusBorderClass}`}
          >
            {isPending ? (
              <Clock3 className={`h-9 w-9 ${statusIconClass}`} />
            ) : isConfirmed ? (
              <CheckCircle2 className={`h-9 w-9 ${statusIconClass}`} />
            ) : (
              <XCircle className={`h-9 w-9 ${statusIconClass}`} />
            )}
          </div>

          <h1 className="text-lg font-bold">
            {getStatusTitle(order.status)}
          </h1>

          <p className="max-w-md text-xs leading-6 text-neutral-300">
            {getStatusDescription(order)}
          </p>

          {statusCheckError && isPending && (
            <p
              role="status"
              className="max-w-md text-xs leading-5 text-amber-300"
            >
              Não conseguimos consultar o pedido neste momento. Vamos tentar
              novamente automaticamente.
            </p>
          )}

          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusLabelClass}`}
          >
            Pedido {getStatusLabel(order.status)}
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
            <span className="text-amber-500">{formatEth(order.total)}</span>
          </div>
        </section>

        <p className="text-center text-[10px] leading-5 text-neutral-400">
          Esta é uma confirmação de pedido de demonstração. Nenhuma transação
          real na blockchain é comprovada por esta tela.
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

        {isRejected && (
          <p className="text-center text-[10px] leading-5 text-neutral-400">
            Nenhuma compra foi concluída. Você pode voltar à loja e tentar
            novamente.
          </p>
        )}
      </section>
    </main>
  );
}

export default OrderConfirmationPage;
