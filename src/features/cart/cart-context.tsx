
import { createContext } from "react";
import type { NFT } from "@/contracts/nft";

export interface CartItem {
  id: string;
  nftId: string;
  name: string;
  tokenId: string;
  price: string;
  quantity: number;
  imageUrl: string;
  edition: string;
  availableEditions?: number;
}

export type PurchasedCartItem = Pick<
  CartItem,
  "id" | "nftId" | "edition" | "quantity"
>;

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (nft: NFT, quantity: number, edition: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  removePurchasedItems: (
    orderId: string,
    purchasedItems: PurchasedCartItem[]
  ) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
