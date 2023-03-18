import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout";

import { Chakra } from "@/Chakra";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Chakra>
  );
}
