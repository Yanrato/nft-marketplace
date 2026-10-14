
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/features/cart/useCart";
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

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const candidate = parsed as Partial<CreatedOrder>;

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.idempotencyKey !== "string" ||
      typeof candidate.createdAt !== "string" ||
      !Array.isArray(candidate.items) ||
      typeof candidate.subtotal !== "string" ||
      typeof candidate.discount !== "string" ||
      typeof candidate.networkFee !== "string" ||
      typeof candidate.total !== "string" ||
      !["pending", "confirmed", "rejected"].includes(
        candidate.status ?? ""
      ) ||
      typeof candidate.customer !== "object" ||
      candidate.customer === null
    ) {
      return null;
    }

    return candidate as CreatedOrder;
  } catch {
    return null;
  }
}

function formatETH(value: string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.000 ETH";
  }

  return `${amount.toFixed(3)} ETH`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "confirmed":
      return "Pedido confirmado";
    case "rejected":
      return "Pedido não aprovado";
    default:
      return "Aguardando confirmação";
  }
}

export function OrderConfirmationPage() {
  const { removePurchasedItems } = useCart();
  const [order, setOrder] = useState<CreatedOrder | null>(readLastOrder);
  const [statusCheckError, setStatusCheckError] = useState(false);

  const orderId = order?.id;
  const orderStatus = order?.status;

  useEffect(() => {
    if (!orderId || orderStatus !== "pending") {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function checkOrderStatus() {
      try {
        const updatedOrder = await getOrderStatus(orderId!);

        if (cancelled) {
          return;
        }

        setOrder(updatedOrder);
        setStatusCheckError(false);

        try {
          localStorage.setItem(
            LAST_ORDER_KEY,
            JSON.stringify(updatedOrder)
          );
        } catch {
          setStatusCheckError(true);
        }

        if (updatedOrder.status === "pending") {
          timeoutId = setTimeout(checkOrderStatus, 1200);
        }
      } catch {
        if (cancelled) {
          return;
        }

        setStatusCheckError(true);
        timeoutId = setTimeout(checkOrderStatus, 2500);
      }
    }

    timeoutId = setTimeout(checkOrderStatus, 500);

    return () => {
      cancelled = true;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderId, orderStatus]);

  useEffect(() => {
    if (!order || order.status !== "confirmed") {
      return;
    }

    removePurchasedItems(order.id, order.items);
  }, [order, removePurchasedItems]);

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 py-20 text-center font-mono text-white">
        <XCircle className="h-12 w-12 text-red-400" />
        <h1 className="text-lg font-bold">
          Nenhum pedido encontrado
        </h1>
        <p className="max-w-md text-xs leading-6 text-neutral-400">
          Não foi possível localizar os dados do último pedido neste
          navegador. Você pode voltar à loja para explorar os NFTs.
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

  const isConfirmed = order.status === "confirmed";
  const isRejected = order.status === "rejected";
  const isPending = order.status === "pending";

  const StatusIcon = isConfirmed
    ? CheckCircle2
    : isRejected
      ? XCircle
      : Clock3;

  const statusColor = isConfirmed
    ? "text-emerald-400"
    : isRejected
      ? "text-red-400"
      : "text-amber-400";

  const statusDescription = isConfirmed
    ? "Sua compra foi confirmada. Os itens comprados foram removidos do carrinho."
    : isRejected
      ? order.statusMessage ??
        "O pedido não pôde ser confirmado. Os itens continuam no carrinho."
      : "Estamos verificando a disponibilidade dos itens e confirmando seu pedido.";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 font-mono text-white md:px-12">
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <Link to="/" className="hover:text-white">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Confirmação do pedido</span>
      </nav>

      <section className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-[#1C120C] px-6 py-10 text-center">
        <StatusIcon className={`h-14 w-14 ${statusColor}`} />

        <h1 className="text-xl font-bold">
          {getStatusLabel(order.status)}
        </h1>

        <p className="max-w-xl text-xs leading-6 text-neutral-400">
          {statusDescription}
        </p>

        {isPending && (
          <span className="mt-1 inline-flex items-center gap-2 text-xs text-amber-400">
            <Clock3 className="h-4 w-4" />
            Verificando automaticamente...
          </span>
        )}

        {statusCheckError && isPending && (
          <p role="status" className="text-xs text-neutral-500">
            Não foi possível consultar o status agora. Tentaremos novamente
            automaticamente.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#1C120C] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-bold">Detalhes do pedido</h2>
            <p className="mt-2 break-all text-xs text-neutral-400">
              Pedido: {order.id}
            </p>
          </div>

          <span className="text-xs text-neutral-400">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-5">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 text-xs"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-14 w-14 rounded-lg border border-white/10 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{item.name}</p>
                <p className="mt-1 text-neutral-400">
                  Edição {item.edition} · Quantidade {item.quantity}
                </p>
                <p className="mt-1 text-neutral-500">
                  {formatETH(item.price)} por unidade
                </p>
              </div>

              <span className="shrink-0 font-bold text-amber-500">
                {formatETH(
                  (Number(item.price) * item.quantity).toString()
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-white/10 pt-5 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Subtotal</span>
            <span>{formatETH(order.subtotal)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Desconto</span>
            <span>{formatETH(order.discount)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Taxa de rede</span>
            <span>{formatETH(order.networkFee)}</span>
          </div>

          <div className="flex justify-between gap-4 border-t border-white/10 pt-4 text-sm font-bold">
            <span>Total</span>
            <span className="text-amber-500">
              {formatETH(order.total)}
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-xs font-bold text-neutral-950 transition-colors hover:bg-amber-500"
        >
          <ShoppingBag className="h-4 w-4" />
          Continuar explorando
        </Link>

        {isRejected && (
          <Link
            to="/carrinho"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-white/5"
          >
            <ExternalLink className="h-4 w-4" />
            Voltar ao carrinho
          </Link>
        )}

        {isConfirmed && (
          <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 px-5 py-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Compra concluída
          </span>
        )}

        {isPending && (
          <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 px-5 py-3 text-xs text-amber-400">
            <Clock3 className="h-4 w-4" />
            Aguardando confirmação
          </span>
        )}
      </div>

      {isRejected && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-950/20 p-4 text-xs text-red-300">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Nenhuma quantidade foi removida do carrinho por esta confirmação
            rejeitada. Revise os itens antes de tentar novamente.
          </p>
        </div>
      )}
    </main>
  );
}

export default OrderConfirmationPage;
