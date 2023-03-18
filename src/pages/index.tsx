import { Box } from "@chakra-ui/react";
import { SharedHead } from "@/components/head";
import { Title1 } from "@/components/texts";

export default function Home() {
  return (
    <>
      <SharedHead />
      <Box as="main">
        <Box>
          <Title1>Movies app</Title1>
        </Box>
      </Box>
    </>
  );
}
