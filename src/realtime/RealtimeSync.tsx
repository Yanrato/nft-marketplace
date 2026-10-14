import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import type { NFT } from "@/contracts/nft";
import type { NFTListResponse } from "@/contracts/nft";

interface NFTUpdatedEvent {
  id: string;
  price: string;
  availableEditions: number;
  version: number;
}

type RealtimeWindow = Window & {
  __KURIO_REALTIME__?: {
    requestNFTUpdate: (id: string) => void;
    isConnected: () => boolean;
  };
};

function parseNFTUpdatedEvent(value: unknown): NFTUpdatedEvent | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const event = value as Record<string, unknown>;

  if (
    typeof event.id !== "string" ||
    typeof event.price !== "string" ||
    !/^\d+(\.\d{1,18})?$/.test(event.price) ||
    typeof event.availableEditions !== "number" ||
    !Number.isInteger(event.availableEditions) ||
    event.availableEditions < 0 ||
    typeof event.version !== "number" ||
    !Number.isInteger(event.version) ||
    event.version < 1
  ) {
    return null;
  }

  return {
    id: event.id,
    price: event.price,
    availableEditions: event.availableEditions,
    version: event.version,
  };
}

export function RealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let disposed = false;
    let socket: Socket | undefined;
    let hasConnectedBefore = false;

    const debugWindow = window as RealtimeWindow;

    function applyNFTUpdate(event: NFTUpdatedEvent) {
      let needsReconciliation = false;

      queryClient.setQueriesData<NFTListResponse>(
        { queryKey: ["nfts"] },
        (current) => {
          if (!current) {
            return current;
          }

          let changed = false;

          const data = current.data.map((nft) => {
            if (nft.id !== event.id || event.version <= nft.version) {
              return nft;
            }

            if (event.version > nft.version + 1) {
              needsReconciliation = true;
            }

            changed = true;

            return {
              ...nft,
              price: event.price,
              availableEditions: event.availableEditions,
              version: event.version,
            };
          });

          return changed ? { ...current, data } : current;
        },
      );

      queryClient.setQueryData<NFT>(["nft", event.id], (current) => {
        if (!current || event.version <= current.version) {
          return current;
        }

        if (event.version > current.version + 1) {
          needsReconciliation = true;
        }

        return {
          ...current,
          price: event.price,
          availableEditions: event.availableEditions,
          version: event.version,
        };
      });

      if (needsReconciliation) {
        void queryClient.invalidateQueries({ queryKey: ["nfts"] });
        void queryClient.invalidateQueries({ queryKey: ["nft"] });
      }
    }

    async function connect() {
      try {
        // Importa o cliente somente depois da inicialização do MSW.
        const { io } = await import("socket.io-client");

        if (disposed) {
          return;
        }

        socket = io(window.location.origin, {
          path: "/socket.io/",
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          timeout: 5000,
        });

        socket.on("connect", () => {
          if (hasConnectedBefore) {
            // Ao reconectar, busca novamente o estado oficial via REST.
            void queryClient.invalidateQueries({ queryKey: ["nfts"] });
            void queryClient.invalidateQueries({ queryKey: ["nft"] });
          }

          hasConnectedBefore = true;
          console.info("[realtime] Socket.IO conectado.");
        });

        socket.on("disconnect", (reason) => {
          console.info("[realtime] Socket.IO desconectado:", reason);
        });

        socket.on("nft.updated", (payload: unknown) => {
          const event = parseNFTUpdatedEvent(payload);

          if (!event) {
            console.warn("[realtime] Evento nft.updated inválido.");
            return;
          }

          applyNFTUpdate(event);
        });

        socket.on("realtime:error", (payload: unknown) => {
          console.warn("[realtime] Erro recebido do servidor:", payload);
        });

        if (
          import.meta.env.DEV &&
          import.meta.env.VITE_ENABLE_MOCKS === "true"
        ) {
          const debugApi = {
            requestNFTUpdate(id: string) {
              if (!socket?.connected) {
                console.warn("[realtime] Socket.IO ainda não está conectado.");
                return;
              }

              socket.emit("realtime:request-nft-update", id);
            },
            isConnected() {
              return socket?.connected ?? false;
            },
          };

          debugWindow.__KURIO_REALTIME__ = debugApi;
        }
      } catch (error) {
        if (!disposed) {
          console.error("[realtime] Falha ao iniciar Socket.IO:", error);
        }
      }
    }

    void connect();

    return () => {
      disposed = true;
      socket?.removeAllListeners();
      socket?.disconnect();
      delete debugWindow.__KURIO_REALTIME__;
    };
  }, [queryClient]);

  return null;
}