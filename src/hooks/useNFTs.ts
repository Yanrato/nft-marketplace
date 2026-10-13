import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { NFT } from '@/types';


interface GetNFTsParams {
  category?: string;
  search?: string;
  network?: string;
  page?: number;
}

interface NFTsResponse {
  data: NFT[];
  total: number;
  page: number;
  totalPages: number;
}

export function useNFTs(params: GetNFTsParams = {}) {
  return useQuery({
    queryKey: ['nfts', params],
    queryFn: async () => {
      const response = await api.get<NFTsResponse>('/nfts', { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos de cache fresco
  });
}

export function useNFT(id: string) {
  return useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const response = await api.get<NFT>(`/nfts/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}