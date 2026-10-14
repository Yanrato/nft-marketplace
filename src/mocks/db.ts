import type { NFT } from "@/types";

// Dados-base do catálogo (sem o campo "version", que é adicionado abaixo)
const baseNFTs: Omit<NFT, "version">[] = [
  {
    id: '042',
    name: 'Emerald Ape #042',
    price: '1.19',
    originalPrice: '1.49',
    collection: 'Kurio Apes',
    category: 'Arte digital',
    network: 'Ethereum',
    editions: ['1/1', '1/10', '1/50', 'ABERTA'],
    totalEditions: 50,
    availableEditions: 38,
    rating: 5,
    reviewsCount: 19,
    description: 'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    badge: 'RARO',
    contractAddress: '0x7A42...19E8',
    tokenId: '#0042',
    creatorFee: '5%',
  },
  {
    id: '009',
    name: 'Sage Nomad #009',
    price: '1.69',
    collection: 'Kurio Apes',
    category: 'Arte digital',
    network: 'Ethereum',
    editions: ['1/10', '1/50'],
    totalEditions: 50,
    availableEditions: 12,
    rating: 4.8,
    reviewsCount: 14,
    description: 'Nômade sábio com traje violeta e chapéu bucket clássico.',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x7A42...19E8',
    tokenId: '#0009',
    creatorFee: '5%',
  },
  {
    id: '552',
    name: 'Neon Vessel #552',
    price: '1.99',
    originalPrice: '2.29',
    collection: 'Kurio Editions',
    category: 'Arte 3D',
    network: 'Ethereum',
    editions: ['1/1', '1/10'],
    totalEditions: 10,
    availableEditions: 3,
    rating: 5,
    reviewsCount: 22,
    description: 'Arte digital selecionada de alta resolução explorando luz e textura.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x7A42...19E8',
    tokenId: '#0552',
    creatorFee: '5%',
  },
  {
    id: '118',
    name: 'Cosmic Bloom #118',
    price: '1.29',
    collection: 'Kurio Apes',
    category: 'Fotografia',
    network: 'Polygon',
    editions: ['1/50', 'ABERTA'],
    totalEditions: 50,
    availableEditions: 25,
    rating: 4.7,
    reviewsCount: 9,
    description: 'Edição limitada com procedência na rede Polygon.',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x9B12...33C1',
    tokenId: '#0118',
    creatorFee: '5%',
  },
  {
    id: '314',
    name: 'Violet Nomad #314',
    price: '1.39',
    collection: 'Kurio Apes',
    category: 'Música',
    network: 'Ethereum',
    editions: ['1/50'],
    totalEditions: 50,
    availableEditions: 18,
    rating: 4.9,
    reviewsCount: 31,
    description: 'Colecionável sonoro e visual com direitos autorais verificados.',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x7A42...19E8',
    tokenId: '#0314',
    creatorFee: '5%',
  },
  {
    id: '088',
    name: 'Ivory Baron #088',
    price: '1.79',
    collection: 'Kurio Editions',
    category: 'Arte digital',
    network: 'Ethereum',
    editions: ['1/10', '1/50'],
    totalEditions: 50,
    availableEditions: 7,
    rating: 5,
    reviewsCount: 45,
    description: 'O Barão de Marfim, peça chave com paletó refinado e brinco dourado.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x7A42...19E8',
    tokenId: '#0088',
    creatorFee: '5%',
  },
  {
    id: '207',
    name: 'Golden Beat #207',
    price: '0.99',
    collection: 'Kurio Sound',
    category: 'Música',
    network: 'Solana',
    editions: ['ABERTA'],
    totalEditions: 100,
    availableEditions: 60,
    rating: 4.6,
    reviewsCount: 12,
    description: 'Macaco dourado com fones de estúdio de alta fidelidade.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x4D21...99E0',
    tokenId: '#0207',
    creatorFee: '5%',
  },
  {
    id: '160',
    name: 'Golden Signal #160',
    price: '0.39',
    collection: 'Kurio Sound',
    category: 'Colecionáveis',
    network: 'Solana',
    editions: ['ABERTA'],
    totalEditions: 100,
    availableEditions: 82,
    rating: 4.5,
    reviewsCount: 8,
    description: 'Versão de entrada para novos colecionadores de áudio digital.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    contractAddress: '0x4D21...99E0',
    tokenId: '#0160',
    creatorFee: '5%',
  },
];

// Todo NFT começa na versão 1 (usada depois para o tempo real)
export const initialNFTs: NFT[] = baseNFTs.map((nft) => ({ ...nft, version: 1 }));

// ---------------------------------------------------------------
// NFTs gerados de forma determinística (sempre os mesmos),
// para exercitar filtros e paginação
// ---------------------------------------------------------------
const CATEGORIES = [
  "Arte digital", "Fotografia", "Música", "Arte 3D", "Colecionáveis",
  "Generativa", "Jogos", "Assinaturas", "Utilidade",
];
const NETWORKS = ["Ethereum", "Polygon", "Solana"] as const;
const IMAGES = initialNFTs.slice(0, 3).map((n) => n.imageUrl);

function generateNFTs(count: number): NFT[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1000; // começa em 1000 para não colidir com os ids existentes
    const total = [10, 50, 100][i % 3];
    return {
      id: String(n),
      name: `Kurio Piece #${n}`,
      price: (0.2 + ((i * 37) % 200) / 100).toFixed(2),
      collection: i % 2 === 0 ? "Kurio Apes" : "Kurio Editions",
      category: CATEGORIES[i % CATEGORIES.length],
      network: NETWORKS[i % NETWORKS.length],
      editions: ["1/1", "1/10", "ABERTA"],
      totalEditions: total,
      availableEditions: (i * 7) % total,
      rating: 4 + (i % 10) / 10,
      reviewsCount: 5 + (i % 30),
      description: `Peça colecionável número ${n} da coleção Kurio.`,
      imageUrl: IMAGES[i % IMAGES.length],
      contractAddress: "0x7A42...19E8",
      tokenId: `#${n}`,
      creatorFee: "5%",
      version: 1,
    };
  });
}

export const seedNFTs: NFT[] = [...initialNFTs, ...generateNFTs(36)];

// ---------------------------------------------------------------
// Gerenciamento com persistência local (sustenta o F5)
// ---------------------------------------------------------------
const STORAGE_KEY = 'kurio_nfts_db_v3';

export function getStoredNFTs(): NFT[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNFTs));
    return seedNFTs;
  }
  return JSON.parse(data);
}

export function saveStoredNFTs(nfts: NFT[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts));
}

export function resetDatabase() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedNFTs));
  localStorage.removeItem('kurio_cart');
  localStorage.removeItem('kurio_orders');
}