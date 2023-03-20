import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { SharedHead } from "@/components/head";
import { StyledBox1 } from "@/components/shared";
import { Text1, Title1 } from "@/components/texts";
import { Box } from "@chakra-ui/react";

import { SessionLocal } from "../api/auth/[...nextauth]";
import { StyledModal } from "@/components/modal";
import { Button1 } from "@/components/buttons";
import { Loading } from "@/components/shared";

export default function Profile() {
  const { data: session, status } = useSession();
  const sessionLocal = session as SessionLocal;
  const router = useRouter();

  const [openModalToCreateMovie, setOpenModalToCreateMovie] =
    React.useState(false);

  const [openModalToImportMovies, setOpenModalToImportMovies] =
    React.useState(false);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  } else if (status === "loading") {
    return <Loading />;
  }

  return (
    <>
      <SharedHead />
      <Box as="main">
        <StyledBox1>
          <>
            <Title1>Profile</Title1>
            <Text1>{sessionLocal.user.email}</Text1>
            <Button1
              onClick={() => {
                setOpenModalToCreateMovie(true);
              }}
            >
              Create movie
            </Button1>

            <Button1
              onClick={() => {
                setOpenModalToImportMovies(true);
              }}
            >
              Import movies
            </Button1>
          </>
        </StyledBox1>

        <StyledModal
          title="Create movie"
          isOpen={openModalToCreateMovie}
          onClose={() => {
            setOpenModalToCreateMovie(false);
          }}
        >
          {openModalToCreateMovie ? (
            <CreateMovie accessToken={sessionLocal.accessToken} />
          ) : (
            <></>
          )}
        </StyledModal>

        <StyledModal
          title="Importing movies"
          isOpen={openModalToImportMovies}
          onClose={() => {
            setOpenModalToImportMovies(false);
          }}
        >
          {openModalToImportMovies ? (
            <CreateMovie accessToken={sessionLocal.accessToken} />
          ) : (
            <></>
          )}
        </StyledModal>
      </Box>
    </>
  );
}

export function CreateMovie({ accessToken }: { accessToken: string }) {
  return (
    <Box>
      <Text1>Creating movie</Text1>
    </Box>
  );
}

export function ImportMovies({ accessToken }: { accessToken: string }) {
  return (
    <Box>
      <Text1>Importing movies</Text1>
    </Box>
  );
}
