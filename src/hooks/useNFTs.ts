import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { NFT, NFTFacets, NFTListQuery, NFTListResponse } from "@/contracts/nft";

export function useNFTs(params: Partial<NFTListQuery>) {
  return useQuery({
    queryKey: ["nfts", params], // toda mudança de parâmetro gera uma chave nova
    queryFn: async ({ signal }) => {
      // signal: cancela a requisição anterior se os parâmetros mudarem
      const res = await api.get<NFTListResponse>("/nfts", { params, signal });
      return res.data;
    },
    placeholderData: keepPreviousData, // mantém a lista atual enquanto a próxima carrega
  });
}

export function useNFTFacets() {
  return useQuery({
    queryKey: ["nft-facets"],
    queryFn: async ({ signal }) => {
      const res = await api.get<NFTFacets>("/nfts/facets", { signal });
      return res.data;
    },
    staleTime: 5 * 60_000,
  });
}

export function useNFT(id: string) {
  return useQuery({
    queryKey: ["nft", id],
    queryFn: async ({ signal }) => {
      const res = await api.get<NFT>(`/nfts/${id}`, { signal });
      return res.data;
    },
    enabled: Boolean(id),
  });
}