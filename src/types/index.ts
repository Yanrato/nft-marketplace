export interface NFT {
  id: string;
  name: string;
  price: string;          // Tratado como string decimal para precisão em ETH
  originalPrice?: string;
  collection: string;
  category: string;
  network: 'Ethereum' | 'Polygon' | 'Solana';
  editions: string[];
  totalEditions: number;
  availableEditions: number;
  rating: number;
  reviewsCount: number;
  description: string;
  imageUrl: string;
  badge?: string;
  isFavorite?: boolean;
  contractAddress: string;
  tokenId: string;
  creatorFee: string;
}

export interface CartItem {
  nftId: string;
  nft: NFT;
  quantity: number;
  edition: string;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  date: string;
  items: CartItem[];
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
  walletAddress: string;
  walletType: string;
  network: string;
  status: 'pending' | 'confirmed' | 'rejected';
}