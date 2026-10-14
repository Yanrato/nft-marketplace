import { http, HttpResponse, delay } from "msw";
import Decimal from "decimal.js";
import { getStoredNFTs } from "./db";
import { nftListQuerySchema } from "@/contracts/nft";
import type { ApiError } from "@/contracts/error";

// Resposta de erro sempre no mesmo formato
const apiError = (error: ApiError, status: number) =>
  HttpResponse.json(error, { status });

export const handlers = [
  // GET /api/nfts: busca, filtros, ordenação e paginação
  http.get("/api/nfts", async ({ request }) => {
    await delay(300); // simula a latência da rede

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
    const { search, category, network, minPrice, maxPrice, sort, page, limit } =
      parsed.data;

    let nfts = getStoredNFTs();

    if (category && category !== "Todos") {
      nfts = nfts.filter((n) => n.category === category);
    }
    if (network) {
      nfts = nfts.filter((n) => n.network === network);
    }
    if (search) {
      const q = search.toLowerCase();
      nfts = nfts.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.collection.toLowerCase().includes(q)
      );
    }

    // Faixa de preço (Decimal: sem erro de ponto flutuante)
    if (minPrice) nfts = nfts.filter((n) => new Decimal(n.price).gte(minPrice));
    if (maxPrice) nfts = nfts.filter((n) => new Decimal(n.price).lte(maxPrice));

    // Ordenação
    if (sort === "price-asc") {
      nfts = [...nfts].sort((a, b) => new Decimal(a.price).comparedTo(b.price));
    } else if (sort === "price-desc") {
      nfts = [...nfts].sort((a, b) => new Decimal(b.price).comparedTo(a.price));
    } else if (sort === "popular") {
      nfts = [...nfts].sort((a, b) => b.reviewsCount - a.reviewsCount);
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

  // GET /api/nfts/facets: contagens reais e faixa de preço.
  // IMPORTANTE: precisa vir ANTES de "/api/nfts/:id", senão "facets" seria tratado como id.
  http.get("/api/nfts/facets", async () => {
    await delay(150);
    const nfts = getStoredNFTs();

    const countBy = (key: "category" | "network") => {
      const counts = new Map<string, number>();
      nfts.forEach((n) => counts.set(n[key], (counts.get(n[key]) ?? 0) + 1));
      return [...counts].map(([name, count]) => ({ name, count }));
    };

    const prices = nfts.map((n) => new Decimal(n.price));
    return HttpResponse.json({
      categories: countBy("category"),
      networks: countBy("network"),
      priceRange: {
        min: Decimal.min(...prices).toString(),
        max: Decimal.max(...prices).toString(),
      },
    });
  }),

  // GET /api/nfts/:id: detalhe de um NFT (404 se não existir)
  http.get("/api/nfts/:id", async ({ params }) => {
    await delay(200);

    const nft = getStoredNFTs().find((item) => item.id === params.id);
    if (!nft) {
      return apiError({ code: "NOT_FOUND", message: "NFT não encontrado" }, 404);
    }
    return HttpResponse.json(nft);
  }),
];