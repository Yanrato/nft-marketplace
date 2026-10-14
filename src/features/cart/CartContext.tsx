import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { NFT } from "@/contracts/nft";
import { CartContext, type CartItem } from "./cart-context";

const STORAGE_KEY = "kurio-cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.id === "string" &&
        typeof item?.nftId === "string" &&
        typeof item?.name === "string" &&
        typeof item?.tokenId === "string" &&
        typeof item?.price === "string" &&
        /^\d+(\.\d{1,18})?$/.test(item.price) &&
        Number.isSafeInteger(item?.quantity) &&
        item.quantity > 0 &&
        typeof item?.imageUrl === "string" &&
        typeof item?.edition === "string"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.error("Não foi possível salvar o carrinho.");
    }
  }, [items]);

  function addItem(nft: NFT, quantity: number, edition: string) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return;

    setItems((currentItems) => {
      const itemId = `${nft.id}::${edition}`;
      const existingItem = currentItems.find(
        (item) => item.id === itemId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: itemId,
          nftId: nft.id,
          name: nft.name,
          tokenId: nft.tokenId,
          price: nft.price,
          quantity,
          imageUrl: nft.imageUrl,
          edition,
        },
      ];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
