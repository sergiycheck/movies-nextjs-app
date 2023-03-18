import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { NextApiRequest } from "next";
import { theme } from "@/styles/theme";

export function Chakra({
  cookies,
  children,
}: {
  cookies: Record<string, string>;
  children: JSX.Element;
}) {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
}

export function getServerSideProps({ req }: { req: NextApiRequest }) {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
}
