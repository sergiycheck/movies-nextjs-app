import { Box } from "@chakra-ui/react";
import { SharedHead } from "@/components/head";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionLocal } from "./api/auth/[...nextauth]";

import React from "react";

import { dehydrate } from "@tanstack/react-query";
import { getNewDefaultQueryClient } from "./_app";
import {
  fetchMoviesList,
  movieKeys,
  MovieQueryParams,
  MoviesFeed,
} from "@/components/features/movies/movies-fiied";

export async function getServerSideProps(context: {
  params: any;
  query: MovieQueryParams;
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const { req, res } = context;

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const sessionLocal = session as SessionLocal;
  const queryClient = getNewDefaultQueryClient();

  await queryClient.prefetchQuery({
    queryKey: movieKeys.list({ offset: 0, limit: 5 }),
    queryFn: fetchMoviesList(sessionLocal.accessToken),
  });

  return {
    props: {
      cookies: req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
      accessToken: sessionLocal.accessToken,
    },
  };
}

export default function Home({ accessToken }: { accessToken: string }) {
  return (
    <>
      <SharedHead />
      <Box as="main">
        <>
          <MoviesFeed accessToken={accessToken} />
        </>
      </Box>
    </>
  );
}
