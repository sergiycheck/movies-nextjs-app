import { Box, Flex } from "@chakra-ui/react";
import { Text1 } from "./texts";

export function StyledBox1({ children }: { children: JSX.Element }) {
  return (
    <Box
      display="flex"
      height="100%"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      gap="3rem"
      width={{ base: "100%", md: "700px" }}
      margin="0 auto"
    >
      {children}
    </Box>
  );
}

export function Loading() {
  return (
    <Flex justifyContent="center" alignItems="center" flexGrow={1} minH="100vh">
      <Text1>Loading ....</Text1>
    </Flex>
  );
}
