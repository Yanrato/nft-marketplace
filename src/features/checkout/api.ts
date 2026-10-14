import { api } from "@/lib/api";
import type { CartItem } from "@/features/cart/CartContext";

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

export interface CreateOrderPayload {
  customer: CheckoutCustomer;
  items: CartItem[];
}

export interface CreatedOrder {
  id: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  status: "confirmed";
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreatedOrder> {
  const response = await api.post<CreatedOrder>(
    "/orders",
    payload
  );

  return response.data;
}
