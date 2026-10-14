import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CartProvider } from "@/features/cart/CartContext";
import { AuthProvider } from "@/features/auth/AuthContext";
import { RealtimeSync } from "@/realtime/RealtimeSync";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (
          isAxiosError(error) &&
          error.response &&
          error.response.status < 500
        ) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RealtimeSync />
          {children}
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
