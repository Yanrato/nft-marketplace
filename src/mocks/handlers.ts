import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import { getStoredNFTs } from "./db";
import { nftListQuerySchema } from "@/contracts/nft";
import type { ApiError } from "@/contracts/error";

const apiError = (error: ApiError, status: number) =>
  HttpResponse.json(error, { status });

export const handlers = [
  http.get("/api/nfts", async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const parsed = nftListQuerySchema.safeParse(
      Object.fromEntries(url.searchParams)
    );
    if (!parsed.success) {
      return apiError(
        { code: "VALIDATION_ERROR", message: "Parâmetros inválidos" },
        400
      );
    }
    const { search, category, network, sort, page, limit } = parsed.data;

    let nfts = getStoredNFTs();

    if (category && category !== "Todos") {
      nfts = nfts.filter((n) => n.category === category);
    }
    if (network) nfts = nfts.filter((n) => n.network === network);
    if (search) {
      const q = search.toLowerCase();
      nfts = nfts.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.collection.toLowerCase().includes(q)
      );
    }

    // Preço comparado com Decimal, nunca com number
    if (sort === "price-asc") {
      nfts = [...nfts].sort((a, b) => new Decimal(a.price).comparedTo(b.price));
    } else if (sort === "price-desc") {
      nfts = [...nfts].sort((a, b) => new Decimal(b.price).comparedTo(a.price));
    }

    const total = nfts.length;
    const start = (page - 1) * limit;

    return HttpResponse.json({
      data: nfts.slice(start, start + limit),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  }),

  // ... mantenha aqui o handler GET /api/nfts/:id que já existe,
  // mas troque o 404 vazio por:
  //   return apiError({ code: "NOT_FOUND", message: "NFT não encontrado" }, 404);
];