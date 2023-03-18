import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react";

import {
  Register,
  SubmitRegisterFormData,
} from "@/components/features/auth/register";

import { SharedHead } from "@/components/head";
import { StyledBox1 } from "@/components/shared";
import { Text1, Title1 } from "@/components/texts";
import { Box, Flex } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { StyledLink } from "@/components/styled-link";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

export default function RegisterPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const submitLoginForm = async (data: SubmitRegisterFormData) => {
    const res = await signIn("credentials_register", {
      redirect: false,
      callbackUrl: `${window.location.origin}`,
      ...data,
    });

    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <SharedHead />
      <Box as="main">
        <StyledBox1>
          <>
            <Title1>Register</Title1>
            <Register submitLoginForm={submitLoginForm} csrfToken={csrfToken} />
            <Flex gap="1rem">
              <Text1>Already have an account ? </Text1>
              <StyledLink href="/auth/signin">Login</StyledLink>
            </Flex>
          </>
        </StyledBox1>
      </Box>
    </>
  );
}
