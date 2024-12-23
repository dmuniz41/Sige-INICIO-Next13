"use client";

import { store } from "../store/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </Provider>
  );
}
