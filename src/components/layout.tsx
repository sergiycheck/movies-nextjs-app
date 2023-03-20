import { SessionLocal } from "@/pages/api/auth/[...nextauth]";
import { Box, Container, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Button1 } from "./buttons";
import { ColorModeToggler } from "./color-mode";
import { StyledLink } from "./styled-link";
import { Text1 } from "./texts";
import { signOut } from "next-auth/react";

function Navbar() {
  const { data: session, status } = useSession();
  const sessionLocal = session as SessionLocal;

  let renderedAuthPart: JSX.Element;
  if (status === "authenticated") {
    renderedAuthPart = (
      <Flex gap="1rem" justifyContent="center" alignItems="center">
        <Text1>{sessionLocal.user.email}</Text1>
        <Button1
          onClick={() => {
            signOut({ callbackUrl: `${window.location.origin}}/auth/signin` });
          }}
        >
          Sign out
        </Button1>
      </Flex>
    );
  } else {
    renderedAuthPart = <StyledLink href="/auth/signin">Sign in</StyledLink>;
  }

  return (
    <Box as="nav">
      <Container maxW="1300px">
        <Flex
          as="ul"
          alignItems="center"
          justifyContent={status === "authenticated" ? "space-between" : "end"}
          gap="1rem"
          paddingBottom="1rem"
          paddingTop="1rem"
          sx={{
            "@media screen and (max-width: 768px)": {
              flexDirection: "column",
            },
          }}
        >
          {status === "authenticated" && (
            <StyledLink href="/">Movies</StyledLink>
          )}

          <Flex
            gap="2rem"
            alignItems="center"
            sx={{
              "@media screen and (max-width: 768px)": {
                flexDirection: "column",
              },
            }}
          >
            {renderedAuthPart}
            <ColorModeToggler />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

function Footer() {
  return (
    <Flex
      as="ul"
      align="center"
      justify="center"
      gap="1rem"
      paddingBottom="1rem"
      paddingTop="1rem"
    >
      <StyledLink href="/">Movies</StyledLink>
    </Flex>
  );
}

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <Box width="100%" height="100%" display="flex" flexDir="column">
      <Navbar />
      <Container maxW="1300px" height="100%" flexGrow={1}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
