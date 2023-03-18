import { Box, Container, Flex } from "@chakra-ui/react";
import { ColorModeToggler } from "./color-mode";
import { StyledLink } from "./styled-link";

function Navbar() {
  return (
    <Box as="nav">
      <Flex as="ul" align="center" justify="space-around" gap="1rem">
        <StyledLink href="/">Home</StyledLink>
        <StyledLink href="/auth/signin">Sign in</StyledLink>
        <ColorModeToggler />
      </Flex>
    </Box>
  );
}

function Footer() {
  return (
    <Flex as="ul" align="center" justify="center" gap="1rem">
      <StyledLink href="/">Home</StyledLink>
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
