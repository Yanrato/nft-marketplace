import { z } from "zod";

const decimal = z.coerce
  .string()
  .regex(/^\d+(\.\d+)?$/)
  .optional()
  .catch(undefined);

// Valores inválidos na URL (ex.: ?sort=banana) viram "sem filtro", nunca quebram a tela
export const homeSearchSchema = z.object({
  q: z.coerce.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  network: z.enum(["Ethereum", "Polygon", "Solana"]).optional().catch(undefined),
  sort: z.enum(["recent", "price-asc", "price-desc", "popular"]).optional().catch(undefined),
  minPrice: decimal,
  maxPrice: decimal,
  page: z.number().int().min(1).optional().catch(undefined),
});

export type HomeSearch = z.infer<typeof homeSearchSchema>;