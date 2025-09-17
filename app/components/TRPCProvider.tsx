// components/TRPCProvider.tsx
"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/api/root";

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // set transformer here (moved from top-level)
        httpBatchLink<AppRouter>({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
      // no top-level transformer
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
