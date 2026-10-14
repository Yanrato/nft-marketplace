
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { NFT } from "@/contracts/nft";
import {
  CartContext,
  type CartItem,
  type PurchasedCartItem,
} from "./cart-context";

const STORAGE_KEY = "kurio-cart";
const PROCESSED_ORDERS_KEY = "kurio_processed_orders";

function isValidCartItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const candidate = item as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.nftId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.tokenId === "string" &&
    typeof candidate.price === "string" &&
    /^\d+(\.\d{1,18})?$/.test(candidate.price) &&
    Number.isSafeInteger(candidate.quantity) &&
    (candidate.quantity as number) > 0 &&
    typeof candidate.imageUrl === "string" &&
    typeof candidate.edition === "string" &&
    (
      candidate.availableEditions === undefined ||
      (
        Number.isSafeInteger(candidate.availableEditions) &&
        (candidate.availableEditions as number) >= 0
      )
    )
  );
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

function loadProcessedOrders(): Set<string> {
  try {
    const stored = localStorage.getItem(PROCESSED_ORDERS_KEY);

    if (!stored) {
      return new Set<string>();
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      !Array.isArray(parsed) ||
      !parsed.every((id) => typeof id === "string")
    ) {
      return new Set<string>();
    }

    return new Set<string>(parsed);
  } catch {
    return new Set<string>();
  }
}

function getNFTQuantity(items: CartItem[], nftId: string): number {
  return items.reduce(
    (total, item) =>
      item.nftId === nftId ? total + item.quantity : total,
    0
  );
}

function getKnownAvailability(
  items: CartItem[],
  nftId: string
): number | undefined {
  const matchingItems = items.filter((item) => item.nftId === nftId);

  const knownValues = matchingItems
    .map((item) => item.availableEditions)
    .filter((value): value is number => value !== undefined);

  if (knownValues.length === 0) {
    return undefined;
  }

  return Math.min(...knownValues);
}

function isValidPurchasedItem(item: PurchasedCartItem): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.nftId === "string" &&
    typeof item.edition === "string" &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const processedOrdersRef = useRef<Set<string>>(loadProcessedOrders());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.error("Não foi possível salvar o carrinho.");
    }
  }, [items]);

  function addItem(nft: NFT, quantity: number, edition: string) {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      !nft.editions.includes(edition) ||
      nft.availableEditions < 1
    ) {
      return;
    }

    setItems((currentItems) => {
      const itemId = `${nft.id}::${edition}`;
      const existingItem = currentItems.find(
        (item) => item.id === itemId
      );

      const currentNFTQuantity = getNFTQuantity(currentItems, nft.id);
      const requestedTotal = currentNFTQuantity + quantity;

      if (requestedTotal > nft.availableEditions) {
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                name: nft.name,
                tokenId: nft.tokenId,
                price: nft.price,
                imageUrl: nft.imageUrl,
                availableEditions: nft.availableEditions,
                quantity: item.quantity + quantity,
              }
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
          availableEditions: nft.availableEditions,
        },
      ];
    });
  }

  function updateQuantity(id: string, delta: number) {
    if (!Number.isSafeInteger(delta) || delta === 0) {
      return;
    }

    setItems((currentItems) => {
      const targetItem = currentItems.find((item) => item.id === id);

      if (!targetItem) {
        return currentItems;
      }

      const nextQuantity = targetItem.quantity + delta;

      if (nextQuantity < 1 || !Number.isSafeInteger(nextQuantity)) {
        return currentItems;
      }

      if (delta > 0) {
        const currentNFTQuantity = getNFTQuantity(
          currentItems,
          targetItem.nftId
        );

        const availableEditions = getKnownAvailability(
          currentItems,
          targetItem.nftId
        );

        if (
          availableEditions !== undefined &&
          currentNFTQuantity + delta > availableEditions
        ) {
          return currentItems;
        }
      }

      return currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: nextQuantity }
          : item
      );
    });
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  function removePurchasedItems(
    orderId: string,
    purchasedItems: PurchasedCartItem[]
  ) {
    if (
      !orderId.trim() ||
      processedOrdersRef.current.has(orderId) ||
      !Array.isArray(purchasedItems) ||
      !purchasedItems.every(isValidPurchasedItem)
    ) {
      return;
    }

    // Registra o pedido antes de alterar o carrinho para impedir
    // que efeitos repetidos processem a mesma compra duas vezes.
    const nextProcessedOrders = new Set(processedOrdersRef.current);
    nextProcessedOrders.add(orderId);
    processedOrdersRef.current = nextProcessedOrders;

    try {
      localStorage.setItem(
        PROCESSED_ORDERS_KEY,
        JSON.stringify([...nextProcessedOrders])
      );
    } catch {
      // A proteção em memória continua ativa nesta sessão.
      console.error("Não foi possível salvar os pedidos processados.");
    }

    const purchasedQuantities = new Map<string, number>();

    for (const purchasedItem of purchasedItems) {
      const key = purchasedItem.id;
      const previousQuantity = purchasedQuantities.get(key) ?? 0;

      purchasedQuantities.set(
        key,
        previousQuantity + purchasedItem.quantity
      );
    }

    setItems((currentItems) => {
      const remainingPurchased = new Map(purchasedQuantities);

      const updatedItems: CartItem[] = [];

      for (const cartItem of currentItems) {
        const purchasedQuantity =
          remainingPurchased.get(cartItem.id) ?? 0;

        if (purchasedQuantity <= 0) {
          updatedItems.push(cartItem);
          continue;
        }

        const quantityToRemove = Math.min(
          purchasedQuantity,
          cartItem.quantity
        );

        const remainingQuantity = cartItem.quantity - quantityToRemove;

        remainingPurchased.set(
          cartItem.id,
          purchasedQuantity - quantityToRemove
        );

        if (remainingQuantity > 0) {
          updatedItems.push({
            ...cartItem,
            quantity: remainingQuantity,
          });
        }
      }

      // Compatibilidade caso algum item do pedido tenha um ID diferente,
      // mas corresponda ao mesmo NFT e edição no carrinho.
      for (const purchasedItem of purchasedItems) {
        const fallbackKey = `${purchasedItem.nftId}::${purchasedItem.edition}`;
        const remainingToRemove =
          remainingPurchased.get(purchasedItem.id) ?? 0;

        if (remainingToRemove <= 0) {
          continue;
        }

        let quantityStillToRemove = remainingToRemove;

        for (let index = updatedItems.length - 1; index >= 0; index -= 1) {
          const cartItem = updatedItems[index];

          if (
            cartItem.id !== fallbackKey &&
            !(
              cartItem.nftId === purchasedItem.nftId &&
              cartItem.edition === purchasedItem.edition
            )
          ) {
            continue;
          }

          const quantityToRemove = Math.min(
            quantityStillToRemove,
            cartItem.quantity
          );

          const remainingQuantity = cartItem.quantity - quantityToRemove;
          quantityStillToRemove -= quantityToRemove;

          if (remainingQuantity === 0) {
            updatedItems.splice(index, 1);
          } else {
            updatedItems[index] = {
              ...cartItem,
              quantity: remainingQuantity,
            };
          }

          if (quantityStillToRemove === 0) {
            break;
          }
        }
      }

      return updatedItems;
    });
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
        removePurchasedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
