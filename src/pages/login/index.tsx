import { SharedHead } from "@/components/head";
import { StyledBox1 } from "@/components/shared";
import { Title1 } from "@/components/texts";
import { Box } from "@chakra-ui/react";

export default function Login() {
  return (
    <>
      <SharedHead />
      <Box as="main">
        <StyledBox1>
          <Title1>Login</Title1>
        </StyledBox1>
      </Box>
    </>
  );
}
