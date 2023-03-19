import { Box, Flex } from "@chakra-ui/react";
import { Text1 } from "@/components/texts";

import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";

import React from "react";
import { Button1 } from "@/components/buttons";
import { MoviesFilters } from "@/components/features/movies/filters";
import { z } from "zod";
import { endpoints } from "@/endpoints";
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { getLookUpTableFromArr } from "@/utils/lookup-table";
import { useBoundMoviesStore } from "../store/store";
import { formatDistance } from "date-fns";

export const MovieQueryParamsSchema = z.object({
  actor: z.string().max(100),
  title: z.string().max(100),
  search: z.string().max(100),
  sort: z.enum(["id", "title", "year"]),
  order: z.enum(["ASC", "DESC"]),
  limit: z.number().min(0).max(100),
  offset: z.number().min(0).max(1000),
});

export type MovieQueryParams = Partial<z.infer<typeof MovieQueryParamsSchema>>;

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.number(),
  format: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;
export type MovieLookUp = { [key: string]: Movie };

export const movieKeys = {
  all: [{ scope: "movies" }] as const,

  lists: () => [{ ...movieKeys.all[0], entity: "list" }] as const,

  list: (sorting: MovieQueryParams) =>
    [{ ...movieKeys.lists()[0], sorting }] as const,
};

export const fetchMoviesList =
  (token: string) =>
  async ({
    queryKey: [{ sorting }],
  }: QueryFunctionContext<ReturnType<typeof movieKeys["list"]>>) => {
    const searchParams = new URLSearchParams(sorting as any).toString();

    const response = await axios.get<SuccessMoviesResponse<Movie[]>>(
      endpoints.movies.list(searchParams),
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  };

export function getValidatedQuery(query: MovieQueryParams) {
  let validatedQuery: MovieQueryParams = {};
  let queryValidationResult = MovieQueryParamsSchema.safeParse(query);
  if (queryValidationResult.success) {
    validatedQuery = queryValidationResult.data;
  }

  return validatedQuery;
}

export function MoviesFeed({ accessToken }: { accessToken: string }) {
  const prevQueryParams = useBoundMoviesStore(
    (store) => store.searchFilters.prevQueryParams
  );

  const setPrevQueryParams = useBoundMoviesStore(
    (store) => store.searchFilters.setPrevQueryParams
  );

  const queryParams = useBoundMoviesStore(
    (store) => store.searchFilters.queryParams
  );
  const setQueryParams = useBoundMoviesStore(
    (store) => store.searchFilters.setQueryParams
  );
  const loadMore = useBoundMoviesStore((store) => store.searchFilters.loadMore);
  const setLoadMore = useBoundMoviesStore(
    (store) => store.searchFilters.setLoadMore
  );

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: movieKeys.list(queryParams),
    queryFn: fetchMoviesList(accessToken),
    keepPreviousData: true,
    onSuccess(data) {
      const prevDataResp = queryClient.getQueryData(
        movieKeys.list(prevQueryParams)
      ) as SuccessMoviesResponse<Movie[]> | undefined;

      const prevData = prevDataResp?.data;

      queryClient.setQueriesData(
        movieKeys.list(queryParams),
        (oldDataRespArg: any) => {
          const oldDataResp = oldDataRespArg as SuccessMoviesResponse<Movie[]>;
          const oldData = oldDataResp.data;

          if (oldData && oldData.length && prevData && prevData.length) {
            let prevDataLookUp = getLookUpTableFromArr(prevData);
            let oldDataLookup = getLookUpTableFromArr(oldData);

            const nextLookup = {
              ...prevDataLookUp,
              ...oldDataLookup,
            };

            return {
              data: Object.values(nextLookup),
              status: oldDataResp.status,
              meta: { total: oldDataResp.meta.total },
            };
          }

          return oldDataResp;
        }
      );
    },
  });

  React.useEffect(() => {
    if (data?.data?.length && data?.data?.length >= data?.meta.total) {
      setLoadMore(false);
    }
  }, [data?.data?.length, data?.meta.total, setLoadMore]);

  return (
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

      {data?.data?.map((movie) => {
        return (
          <Box key={movie.id} paddingTop={2} paddingBottom={2}>
            <Text1>{movie.title}</Text1>
            <Text1>{`Format: ${movie.format}`}</Text1>
            <Text1>{`Year: ${movie.year}`}</Text1>
            <Text1>{`Created: ${formatDistance(
              new Date(movie.createdAt),
              new Date(),
              { includeSeconds: true, addSuffix: true }
            )}`}</Text1>

            <Text1>{`Updated: ${formatDistance(
              new Date(movie.updatedAt),
              new Date(),
              { includeSeconds: true, addSuffix: true }
            )}`}</Text1>
          </Box>
        );
      })}
      <Flex justifyContent="center" gap="1rem">
        <Button1
          disabled={!loadMore}
          onClick={() => {
            if (!loadMore) return;

            setPrevQueryParams(queryParams);
            setQueryParams({
              offset: queryParams.offset ? queryParams.offset + 5 : 5,
            });
          }}
        >
          load more
        </Button1>
      </Flex>
    </>
  );
}
