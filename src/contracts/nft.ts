import { z } from "zod";

// Valores em ETH sempre como string decimal (ex.: "1.19"), nunca number
export const decimalString = z
  .string()
  .regex(/^\d+(\.\d{1,18})?$/, "Valor decimal inválido");

export const nftSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: decimalString,
  originalPrice: decimalString.optional(),
  collection: z.string(),
  category: z.string(),
  network: z.enum(["Ethereum", "Polygon", "Solana"]),
  editions: z.array(z.string()),
  totalEditions: z.number().int(),
  availableEditions: z.number().int(),
  rating: z.number(),
  reviewsCount: z.number().int(),
  description: z.string(),
  imageUrl: z.string(),
  badge: z.string().optional(),
  contractAddress: z.string(),
  tokenId: z.string(),
  creatorFee: z.string(),
  version: z.number().int().default(1), // usado depois no tempo real
});
export type NFT = z.infer<typeof nftSchema>;

// Parâmetros aceitos na listagem
export const nftListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  network: z.enum(["Ethereum", "Polygon", "Solana"]).optional(),
  minPrice: decimalString.optional(),
  maxPrice: decimalString.optional(),
  sort: z.enum(["recent", "price-asc", "price-desc", "popular"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(8),
});
export type NFTListQuery = z.infer<typeof nftListQuerySchema>;

export interface NFTListResponse {
  data: NFT[];
  total: number;
  page: number;
  totalPages: number;
}

// Contagens reais por filtro e faixa de preço do catálogo
export interface NFTFacets {
  categories: { name: string; count: number }[];
  networks: { name: string; count: number }[];
  priceRange: { min: string; max: string };
}