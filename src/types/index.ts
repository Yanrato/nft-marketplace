import type { NFT } from "@/contracts/nft";

export type { NFT };

export interface CartItem {
  nftId: string;
  nft: NFT;
  quantity: number;
  edition: string;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  date: string;
  items: CartItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  walletAddress: string;
  walletType: string;
  network: string;
  status: "pending" | "confirmed" | "rejected";
}