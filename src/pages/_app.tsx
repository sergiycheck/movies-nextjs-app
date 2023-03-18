import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { Chakra } from "@/Chakra";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Chakra cookies={pageProps.cookies}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Chakra>
    </SessionProvider>
  );
}
