import React from "react";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { Chakra } from "@/Chakra";
import { SessionProvider } from "next-auth/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/styles/globals.css";

export function getNewDefaultQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => getNewDefaultQueryClient());

  return (
    // next-auth session
    <SessionProvider session={pageProps.session}>
      {/*tankstack query with ssr  */}
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {/* styling */}
          <Chakra cookies={pageProps.cookies}>
            <Layout>
              {/* app */}
              <Component {...pageProps} />
            </Layout>
          </Chakra>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}
