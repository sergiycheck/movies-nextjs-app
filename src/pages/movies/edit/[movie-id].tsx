import React from "react";
import { fetchMovieById } from "@/components/features/movies/movie-item";
import {
  MovieById,
  movieKeys,
} from "@/components/features/movies/movies-fiied";
import { SharedHead } from "@/components/head";
import { Loading, StyledBox1 } from "@/components/shared";
import { Text1, Title1 } from "@/components/texts";
import { SessionLocal } from "@/pages/api/auth/[...nextauth]";
import { Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import z from "zod";
import { useForm } from "react-hook-form";
import { Button1 } from "@/components/buttons";
import { EditMovie } from "@/components/features/movies/edit/edit-movie";

export const movieIdQueryShema = z.object({
  "movie-id": z.string().regex(/^\d+$/).transform(Number),
});

export type MovieIdQuryType = z.infer<typeof movieIdQueryShema>;

export default function EditMovieContainer() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const sessionLocal = session as SessionLocal;

  const validatedMovieQueryMemoized = React.useMemo(() => {
    if (!router.query) return undefined;
    const validationRes = movieIdQueryShema.safeParse(router.query);
    if (validationRes.success) {
      return validationRes.data;
    }
    return undefined;
  }, [router.query]);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
  } else if (status === "loading") {
    return <Loading />;
  }

  let renderedEditMovie: JSX.Element;

  if (validatedMovieQueryMemoized?.["movie-id"]) {
    renderedEditMovie = (
      <EditMovie
        movieId={validatedMovieQueryMemoized?.["movie-id"]}
        accessToken={sessionLocal.accessToken}
      />
    );
  } else {
    renderedEditMovie = <Title1>Bad movie id</Title1>;
  }

  return (
    <>
      <SharedHead />
      <Box as="main">
        <StyledBox1>{renderedEditMovie}</StyledBox1>
      </Box>
    </>
  );
}
