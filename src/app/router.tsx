import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { App } from "../App";
import { HomePage } from "../pages/HomePage";
import { NFTDetailsPage } from "../pages/NFTDetailsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { ProfilePage } from "../pages/ProfilePage";
import { homeSearchSchema } from "../features/catalog/search";
import NotFoundPage from "@/pages/NotFound";

// 1. Rota Raiz (o shell com Navbar e Footer) + página para rotas inexistentes
const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFoundPage,
});

// 2. Rota Home (/): busca, filtros, ordenação e página ficam na URL
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  validateSearch: homeSearchSchema,
});

// 3. Rota Detalhes do NFT (/nft/$id)
const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: NFTDetailsPage,
});

// 4. Rota Carrinho (/carrinho)
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carrinho",
  component: CartPage,
});

// 5. Rota Checkout (/checkout)
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

// 6. Rota Confirmação (/confirmacao)
const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmacao",
  component: OrderConfirmationPage,
});

// 7. Rota Perfil (/perfil)
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: ProfilePage,
});

// 8. Árvore de rotas
const routeTree = rootRoute.addChildren([
  homeRoute,
  nftDetailsRoute,
  cartRoute,
  checkoutRoute,
  confirmationRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
});

// Tipagem global das rotas para o TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}