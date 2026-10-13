import { http, HttpResponse, delay } from 'msw';
import { getStoredNFTs } from './db';

export const handlers = [
  // GET /api/nfts (com suporte a busca, filtros, ordenação e paginação)
  http.get('/api/nfts', async ({ request }) => {
    // Simula latência de rede realista (exigência do edital)
    await delay(300);

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search')?.toLowerCase();
    const network = url.searchParams.get('network');
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '8');

    let nfts = getStoredNFTs();

    // Filtro por categoria
    if (category && category !== 'Todos') {
      nfts = nfts.filter(nft => nft.category === category);
    }

    // Filtro por busca
    if (search) {
      nfts = nfts.filter(nft => 
        nft.name.toLowerCase().includes(search) || 
        nft.collection.toLowerCase().includes(search)
      );
    }

    // Filtro por rede
    if (network) {
      nfts = nfts.filter(nft => nft.network === network);
    }

    // Paginação
    const total = nfts.length;
    const startIndex = (page - 1) * limit;
    const paginatedNFTs = nfts.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      data: paginatedNFTs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }),

  // GET /api/nfts/:id (Detalhe do NFT com tratamento de 404)
  http.get('/api/nfts/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const nfts = getStoredNFTs();
    const nft = nfts.find(item => item.id === id);

    if (!nft) {
      return new HttpResponse(null, { status: 404, statusText: 'NFT Not Found' });
    }

    return HttpResponse.json(nft);
  }),
];