import { Box, Flex } from "@chakra-ui/react";
import { SharedHead } from "@/components/head";
import { Text1 } from "@/components/texts";
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
import { MoviesFilters } from "@/components/features/movies/filters";

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

  const getMoviesLookupTable = (movies: Movie[]) => {
    const mooviesTable: MovieLookUpTable = {};
    movies.forEach((movie) => {
      mooviesTable[movie.id] = movie;
    });

    return mooviesTable;
  };

  React.useEffect(() => {
    if (movies && movies.length) {
      const mooviesTable = getMoviesLookupTable(movies);

      setMoviesLookUp((prev) => {
        return {
          ...prev,
          ...mooviesTable,
        };
      });
    }
  }, [movies]);

  const [offset, setOffset] = React.useState(10);
  const [isReset, setIsReset] = React.useState(false);
  React.useEffect(() => {
    if (isReset && movies && movies.length) {
      const mooviesTable = getMoviesLookupTable(movies);
      setMoviesLookUp((prev) => {
        return {
          ...mooviesTable,
        };
      });
      setIsReset(() => false);
    }
  }, [isReset, movies]);
  const router = useRouter();

  return (
    <>
      <SharedHead />
      <Box as="main">
        <>
          <Flex
            gap={2}
            paddingTop={2}
            paddingBottom={2}
            alignItems="center"
            sx={{
              "@media screen and (max-width: 768px)": {
                flexDirection: "column",
              },
            }}
          >
            <MoviesFilters />
          </Flex>

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
