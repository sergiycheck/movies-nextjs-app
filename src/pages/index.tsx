import { Box, Flex } from "@chakra-ui/react";
import { SharedHead } from "@/components/head";
import { Text1, Title1 } from "@/components/texts";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import {
  authOptions,
  baseUrl,
  ErrorResponse,
  SessionLocal,
  SuccessResponse,
} from "./api/auth/[...nextauth]";
import React from "react";
import { Button1 } from "@/components/buttons";
import { useRouter } from "next/router";

export type MovieQueryParams = {
  actor: string;
  title: string; // my movie title
  search: string; //for movie and actor
  sort: "id" | "title" | "year";
  order: "ASC" | "DESC";
  limit: string;
  offset: string;
};

export type Movie = {
  id: number;
  title: string;
  year: number;
  format: string;
  createdAt: string;
  updatedAt: string;
};

export async function getServerSideProps(context: {
  params: any;
  query: MovieQueryParams;
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const { req, res, query } = context;

  const session = await getServerSession(req, res, authOptions);
  const sessionLocal = session as SessionLocal;

  const searchParams = new URLSearchParams(query);

  const urlToFetch = `${baseUrl}/movies?${searchParams.toString()}`;

  const moviesResponse = await fetch(urlToFetch, {
    method: "GET",
    headers: { Authorization: `${sessionLocal.accessToken}` },
  });

  let movies: Movie[] = [];
  if (moviesResponse.ok) {
    const jsonMovies = (await moviesResponse.json()) as SuccessResponse<
      Movie[]
    >;

    if (jsonMovies.status) {
      movies = jsonMovies.data;
    } else {
      const errResponse = jsonMovies as unknown as ErrorResponse;
      throw new Error(JSON.stringify(errResponse.error));
    }
  }

  return {
    props: {
      cookies: req.headers.cookie ?? "",
      movies,
    },
  };
}

type MovieLookUpTable = {
  [key: string]: Movie;
};

export default function Home({ movies }: { movies?: Movie[] }) {
  const [moviesLookUp, setMoviesLookUp] = React.useState<MovieLookUpTable>({});

  React.useEffect(() => {
    if (movies && movies.length) {
      let mooviesTable: MovieLookUpTable = {};
      movies.forEach((movie) => {
        mooviesTable[movie.id] = movie;
      });

      setMoviesLookUp((prev) => {
        return {
          ...prev,
          ...mooviesTable,
        };
      });
    }
  }, [movies]);
  const [offset, setOffset] = React.useState(10);
  const router = useRouter();

  return (
    <>
      <SharedHead />
      <Box as="main">
        <>
          <Title1>Movies app</Title1>
          {Object.values(moviesLookUp)?.map((movie) => {
            return (
              <Box key={movie.id}>
                <Text1>{movie.title}</Text1>
              </Box>
            );
          })}
          <Flex justifyContent="center" gap="1rem">
            <Button1
              onClick={() => {
                setOffset((prev) => {
                  const next = prev - 10;
                  if (next <= 0) {
                    return 0;
                  }
                  return next;
                });

                const nextRoute = `/?${new URLSearchParams({
                  offset: `${offset}`,
                })}`;

                router.push(nextRoute);
              }}
            >
              load back
            </Button1>

            <Button1
              onClick={() => {
                setOffset((prev) => prev + 10);
                const nextRoute = `/?${new URLSearchParams({
                  offset: `${offset}`,
                })}`;

                router.push(nextRoute);
              }}
            >
              load more
            </Button1>
          </Flex>
        </>
      </Box>
    </>
  );
}
