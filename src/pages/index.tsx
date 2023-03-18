import { Box } from "@chakra-ui/react";
import { SharedHead } from "@/components/head";
import { Title1 } from "@/components/texts";
import { useSession } from "next-auth/react";

export { getServerSideProps } from "@/Chakra";

export default function Home() {
  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  return (
    <>
      <SharedHead />
      <Box as="main">
        <Title1>Movies app</Title1>
      </Box>
    </>
  );
}
