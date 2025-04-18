"use client";

import { store } from "../store/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SessionProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff6600",
                borderRadius: 4
              }
            }}
          >
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ConfigProvider>
        </SessionProvider>
      </Provider>
    </QueryClientProvider>
  );
}
