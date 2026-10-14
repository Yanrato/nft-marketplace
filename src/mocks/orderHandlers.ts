import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import type { CreateOrderPayload, CreatedOrder } from "@/features/checkout/api";

const ORDERS_STORAGE_KEY = "kurio_orders";

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    await delay(400);

    let body: CreateOrderPayload;

    try {
      body = (await request.json()) as CreateOrderPayload;
    } catch {
      return HttpResponse.json(
        { code: "INVALID_JSON", message: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { customer, items } = body ?? {};

    if (
      !customer ||
      !customer.displayName?.trim() ||
      !customer.username?.trim() ||
      !customer.profileName?.trim() ||
      !customer.walletAddress?.trim() ||
      !customer.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      !["Ethereum", "Polygon", "Solana"].includes(customer.network) ||
      !["Coinbase", "MetaMask", "WalletConnect"].includes(customer.walletType) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return HttpResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Preencha os dados obrigatórios e informe os itens da compra.",
        },
        { status: 400 }
      );
    }

    const invalidItem = items.some(
      (item) =>
        !item ||
        typeof item.nftId !== "string" ||
        typeof item.name !== "string" ||
        typeof item.price !== "string" ||
        !/^\d+(\.\d{1,18})?$/.test(item.price) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.edition !== "string"
    );

    if (invalidItem) {
      return HttpResponse.json(
        {
          code: "INVALID_ITEMS",
          message: "Um ou mais itens do carrinho são inválidos.",
        },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) =>
        sum.plus(new Decimal(item.price).mul(item.quantity)),
      new Decimal(0)
    );

    const discount = new Decimal(0);
    const networkFee = new Decimal("0.016");
    const total = subtotal.minus(discount).plus(networkFee);

    const order: CreatedOrder = {
      id: `KUR-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal: subtotal.toString(),
      discount: discount.toString(),
      networkFee: networkFee.toString(),
      total: total.toString(),
      status: "confirmed",
    };

    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      const previousOrders: CreatedOrder[] = stored
        ? JSON.parse(stored)
        : [];

      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([...previousOrders, order])
      );
    } catch {
      return HttpResponse.json(
        {
          code: "STORAGE_ERROR",
          message: "Não foi possível registrar o pedido.",
        },
        { status: 500 }
      );
    }

    return HttpResponse.json(order, { status: 201 });
  }),
];
