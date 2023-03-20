import { Button1 } from "@/components/buttons";
import { Text1 } from "@/components/texts";
import { endpoints } from "@/endpoints";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import { Box, Flex } from "@chakra-ui/react";
import {
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { formatDistance } from "date-fns";
import { useRouter } from "next/router";
import { Movie, MovieById, movieKeys } from "./movies-fiied";

export const fetchMovieById =
  (token: string) =>
  async ({
    queryKey: [{ byIdParams }],
  }: QueryFunctionContext<ReturnType<typeof movieKeys["byId"]>>) => {
    const response = await axios.get<SuccessMoviesResponse<MovieById>>(
      endpoints.movies.byId(`${byIdParams.id}`),
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  };

export const deleteMovieById = async ({
  token,
  id,
}: {
  id: number;
  token: string;
}) => {
  const response = await axios.delete<SuccessMoviesResponse<undefined>>(
    endpoints.movies.byId(`${id}`),
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const MovieByIdExcerpt = ({
  accessToken,
  selectedMovie,
  setSelectedMovie,
}: {
  accessToken: string;
  selectedMovie: Movie;
  setSelectedMovie: (data: Movie | undefined) => void;
}) => {
  const { id: movieId } = selectedMovie;

  const router = useRouter();

  const { data: dataResult } = useQuery({
    queryKey: movieKeys.byId({ id: movieId }),
    queryFn: fetchMovieById(accessToken),
  });

  const data = dataResult?.data;

  const queryClient = useQueryClient();

  const deleteMovieByIdMutation = useMutation({
    mutationFn: deleteMovieById,
    onSuccess: (data) => {
      setSelectedMovie(undefined);
      queryClient.invalidateQueries(movieKeys.lists());
    },
  });

  return (
    <Box>
      {data ? (
        <Flex flexDir="column" gap={2}>
          <SingleMovieSharedView movie={data} />

          <Flex gap={2}>
            <Button1
              onClick={() => {
                router.push(`/movies/edit/${movieId}`);
              }}
            >
              Edit
            </Button1>
            <Button1
              onClick={() => {
                deleteMovieByIdMutation.mutate({
                  id: movieId,
                  token: accessToken,
                });
              }}
            >
              Delete
            </Button1>
          </Flex>

          <Text1>Actors:</Text1>
          <Flex flexDir="column" gap={2}>
            {data.actors.map((actor) => (
              <Box
                key={actor.id}
                padding={2}
                border="1px"
                borderColor="gray.600"
                borderRadius={10}
              >
                <Text1>{actor.name}</Text1>
                <GetDaysAgoText1 name="Created" dateIso={actor.createdAt} />
                <GetDaysAgoText1 name="Updated" dateIso={actor.updatedAt} />
              </Box>
            ))}
          </Flex>
        </Flex>
      ) : (
        <></>
      )}
    </Box>
  );
};

export const SingleMovieSharedView = ({ movie }: { movie: Movie }) => {
  return (
    <>
      <Text1>{movie.title}</Text1>
      <Text1>{`Format: ${movie.format}`}</Text1>
      <Text1>{`Year: ${movie.year}`}</Text1>
      <GetDaysAgoText1 name="Created" dateIso={movie.createdAt} />
      <GetDaysAgoText1 name="Updated" dateIso={movie.updatedAt} />
    </>
  );
};

export const GetDaysAgoText1 = ({
  name,
  dateIso,
}: {
  name: string;
  dateIso: string;
}) => {
  return (
    <Text1>{`${name}: ${formatDistance(new Date(dateIso), new Date(), {
      includeSeconds: true,
      addSuffix: true,
    })}`}</Text1>
  );
};
