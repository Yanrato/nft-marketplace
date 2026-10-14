import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import Decimal from "decimal.js";
import { getStoredNFTs, saveStoredNFTs } from "./db";

export interface NFTUpdatedEvent {
  id: string;
  price: string;
  availableEditions: number;
  version: number;
}

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socketURL = `${protocol}//${window.location.host}/socket.io/`;

const socketLink = ws.link("*/socket.io/");

socketLink.addEventListener("connection", (connection) => {
  const { server } = toSocketIo(connection);

  server.on(
    "realtime:request-nft-update",
    (_messageEvent, id: unknown) => {
      if (typeof id !== "string" || !id.trim()) {
        return;
      }

      const nfts = getStoredNFTs();
      const nft = nfts.find((item) => item.id === id);

      if (!nft) {
        server.emit("realtime:error", {
          code: "NFT_NOT_FOUND",
          message: "NFT não encontrado.",
        });
        return;
      }

      const updatedNFT = {
        ...nft,
        price: new Decimal(nft.price).plus("0.01").toFixed(),
        availableEditions: Math.max(0, nft.availableEditions - 1),
        version: nft.version + 1,
      };

      saveStoredNFTs(
        nfts.map((item) => (item.id === id ? updatedNFT : item)),
      );

      const event: NFTUpdatedEvent = {
        id: updatedNFT.id,
        price: updatedNFT.price,
        availableEditions: updatedNFT.availableEditions,
        version: updatedNFT.version,
      };

      server.emit("nft.updated", event);
    },
  );
});