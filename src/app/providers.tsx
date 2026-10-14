import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CartProvider } from "@/features/cart/CartContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // dado "fresco" por 1 min: evita requisições repetidas
      gcTime: 5 * 60_000, // cache descartado após 5 min sem uso
      refetchOnWindowFocus: true, // sincroniza ao voltar para a aba
      retry: (failureCount, error) => {
        // Erros 4xx são definitivos (validação, 404, 401): não repetir
        if (isAxiosError(error) && error.response && error.response.status < 500) {
          return false;
        }
        return failureCount < 2; // falha transitória/rede: até 2 novas tentativas
      },
    },
    mutations: { retry: false }, // mutations nunca repetem sozinhas (evita duplicar operações)
  },
});


 export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
}