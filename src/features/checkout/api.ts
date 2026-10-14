
import { api } from "@/lib/api";
import type { CartItem } from "@/features/cart/cart-context";

export interface CheckoutCustomer {
  displayName: string;
  username: string;
  network: "Ethereum" | "Polygon" | "Solana";
  profileName: string;
  walletAddress: string;
  secondaryWallet: string;
  walletType: "Coinbase" | "MetaMask" | "WalletConnect";
  referralCode: string;
  email: string;
  ensName: string;
  useOtherWallet: boolean;
  notes: string;
}

export type OrderStatus = "pending" | "confirmed" | "rejected";

export interface CreateOrderPayload {
  customer: CheckoutCustomer;
  items: CartItem[];
  idempotencyKey: string;
}

export interface CreatedOrder {
  id: string;
  idempotencyKey: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  status: OrderStatus;
  statusMessage?: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreatedOrder> {
  const response = await api.post<CreatedOrder>("/orders", payload, {
    headers: {
      "Idempotency-Key": payload.idempotencyKey,
    },
  });

  return response.data;
}

export async function getOrderStatus(
  orderId: string
): Promise<CreatedOrder> {
  const response = await api.get<CreatedOrder>(
    `/orders/${encodeURIComponent(orderId)}`
  );

  return response.data;
}
