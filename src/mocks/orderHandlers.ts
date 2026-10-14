
import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import type {
  CreateOrderPayload,
  CreatedOrder,
} from "@/features/checkout/api";
import type { CartItem } from "@/features/cart/cart-context";
import { getStoredNFTs, saveStoredNFTs } from "./db";

const ORDERS_STORAGE_KEY = "kurio_orders";
const NETWORK_FEE = new Decimal("0.016");

function readOrders(): CreatedOrder[] {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as CreatedOrder[]) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: CreatedOrder[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function errorResponse(
  code: string,
  message: string,
  status: number
) {
  return HttpResponse.json({ code, message }, { status });
}

function isValidCustomer(customer: CheckoutCustomerLike): boolean {
  return (
    typeof customer.displayName === "string" &&
    Boolean(customer.displayName.trim()) &&
    typeof customer.username === "string" &&
    Boolean(customer.username.trim()) &&
    typeof customer.profileName === "string" &&
    Boolean(customer.profileName.trim()) &&
    typeof customer.walletAddress === "string" &&
    customer.walletAddress.trim().length >= 10 &&
    typeof customer.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) &&
    ["Ethereum", "Polygon", "Solana"].includes(customer.network) &&
    ["Coinbase", "MetaMask", "WalletConnect"].includes(
      customer.walletType
    )
  );
}

type CheckoutCustomerLike = CreateOrderPayload["customer"];

function aggregateQuantities(items: CartItem[]): Map<string, number> {
  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(
      item.nftId,
      (quantities.get(item.nftId) ?? 0) + item.quantity
    );
  }

  return quantities;
}

function hasSufficientStock(
  items: CartItem[],
  quantities: Map<string, number>
): boolean {
  const nfts = getStoredNFTs();

  for (const item of items) {
    const nft = nfts.find((entry) => entry.id === item.nftId);

    if (!nft || !nft.editions.includes(item.edition)) {
      return false;
    }
  }

  for (const [nftId, quantity] of quantities) {
    const nft = nfts.find((entry) => entry.id === nftId);

    if (!nft || quantity > nft.availableEditions) {
      return false;
    }
  }

  return true;
}

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    await delay(400);

    let body: CreateOrderPayload;

    try {
      body = (await request.json()) as CreateOrderPayload;
    } catch {
      return errorResponse(
        "INVALID_JSON",
        "Os dados enviados são inválidos.",
        400
      );
    }

    const idempotencyKey =
      request.headers.get("Idempotency-Key") ?? body?.idempotencyKey;

    if (
      typeof idempotencyKey !== "string" ||
      idempotencyKey.trim().length < 8
    ) {
      return errorResponse(
        "INVALID_IDEMPOTENCY_KEY",
        "Chave de idempotência inválida.",
        400
      );
    }

    const previousOrders = readOrders();

    const existingOrder = previousOrders.find(
      (order) => order.idempotencyKey === idempotencyKey
    );

    if (existingOrder) {
      return HttpResponse.json(existingOrder, { status: 200 });
    }

    const { customer, items } = body ?? {};

    if (
      !customer ||
      !isValidCustomer(customer) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Preencha os dados obrigatórios e informe os itens da compra.",
        400
      );
    }

    const invalidItem = items.some(
      (item) =>
        !item ||
        typeof item.nftId !== "string" ||
        typeof item.edition !== "string" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.price !== "string" ||
        !/^\d+(\.\d{1,18})?$/.test(item.price)
    );

    if (invalidItem) {
      return errorResponse(
        "INVALID_ITEMS",
        "Um ou mais itens do carrinho são inválidos.",
        400
      );
    }

    const nfts = getStoredNFTs();
    const quantityByNFT = aggregateQuantities(items);
    const verifiedItems: CartItem[] = [];

    for (const item of items) {
      const nft = nfts.find((entry) => entry.id === item.nftId);

      if (!nft) {
        return errorResponse(
          "NFT_NOT_FOUND",
          `O NFT ${item.nftId} não foi encontrado.`,
          404
        );
      }

      if (!nft.editions.includes(item.edition)) {
        return errorResponse(
          "INVALID_EDITION",
          `A edição selecionada para ${nft.name} não existe.`,
          400
        );
      }

      verifiedItems.push({
        ...item,
        name: nft.name,
        tokenId: nft.tokenId,
        price: nft.price,
        imageUrl: nft.imageUrl,
      });
    }

    if (!hasSufficientStock(verifiedItems, quantityByNFT)) {
      return errorResponse(
        "INSUFFICIENT_STOCK",
        "O estoque de um ou mais NFTs é insuficiente.",
        409
      );
    }

    const subtotal = verifiedItems.reduce(
      (sum, item) =>
        sum.plus(new Decimal(item.price).mul(item.quantity)),
      new Decimal(0)
    );

    const discount = new Decimal(0);
    const networkFee = NETWORK_FEE;
    const total = subtotal.minus(discount).plus(networkFee);

    if (!total.isFinite() || total.isNegative()) {
      return errorResponse(
        "INVALID_TOTAL",
        "Não foi possível calcular o total do pedido.",
        400
      );
    }

    const order: CreatedOrder = {
      id: `KUR-${crypto.randomUUID()}`,
      idempotencyKey,
      createdAt: new Date().toISOString(),
      customer,
      items: verifiedItems,
      subtotal: subtotal.toString(),
      discount: discount.toString(),
      networkFee: networkFee.toString(),
      total: total.toString(),
      status: "pending",
      statusMessage: "Aguardando confirmação do pedido.",
    };

    try {
      saveOrders([...previousOrders, order]);
    } catch {
      return errorResponse(
        "STORAGE_ERROR",
        "Não foi possível registrar o pedido.",
        500
      );
    }

    return HttpResponse.json(order, { status: 201 });
  }),

  http.get("/api/orders/:id", async ({ params }) => {
    await delay(1200);

    const orderId = String(params.id);
    const orders = readOrders();
    const orderIndex = orders.findIndex((entry) => entry.id === orderId);

    if (orderIndex === -1) {
      return errorResponse(
        "ORDER_NOT_FOUND",
        "O pedido solicitado não foi encontrado.",
        404
      );
    }

    const order = orders[orderIndex];

    if (order.status !== "pending") {
      return HttpResponse.json(order);
    }

    const simulateRejection =
      typeof order.customer.notes === "string" &&
      order.customer.notes.toUpperCase().includes("[SIMULAR_REJEICAO]");

    if (simulateRejection) {
      const rejectedOrder: CreatedOrder = {
        ...order,
        status: "rejected",
        statusMessage:
          "Pedido rejeitado pela regra de simulação. Nenhuma compra foi concluída.",
      };

      try {
        const updatedOrders = [...orders];
        updatedOrders[orderIndex] = rejectedOrder;
        saveOrders(updatedOrders);
      } catch {
        return errorResponse(
          "STORAGE_ERROR",
          "Não foi possível atualizar o estado do pedido.",
          500
        );
      }

      return HttpResponse.json(rejectedOrder);
    }

    const quantities = aggregateQuantities(order.items);

    if (!hasSufficientStock(order.items, quantities)) {
      const rejectedOrder: CreatedOrder = {
        ...order,
        status: "rejected",
        statusMessage:
          "O pedido foi rejeitado porque não há estoque suficiente para concluir a compra.",
      };

      try {
        const updatedOrders = [...orders];
        updatedOrders[orderIndex] = rejectedOrder;
        saveOrders(updatedOrders);
      } catch {
        return errorResponse(
          "STORAGE_ERROR",
          "Não foi possível atualizar o estado do pedido.",
          500
        );
      }

      return HttpResponse.json(rejectedOrder);
    }

    const nfts = getStoredNFTs();

    const updatedNFTs = nfts.map((nft) => {
      const purchasedQuantity = quantities.get(nft.id) ?? 0;

      if (purchasedQuantity === 0) {
        return nft;
      }

      return {
        ...nft,
        availableEditions: nft.availableEditions - purchasedQuantity,
        version: nft.version + 1,
      };
    });

    const confirmedOrder: CreatedOrder = {
      ...order,
      status: "confirmed",
      statusMessage: "Seu pedido foi confirmado com sucesso.",
    };

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = confirmedOrder;

    try {
      saveStoredNFTs(updatedNFTs);

      try {
        saveOrders(updatedOrders);
      } catch (error) {
        saveStoredNFTs(nfts);
        throw error;
      }
    } catch {
      return errorResponse(
        "STORAGE_ERROR",
        "Não foi possível concluir o pedido. Tente consultar novamente.",
        500
      );
    }

    return HttpResponse.json(confirmedOrder);
  }),
];
