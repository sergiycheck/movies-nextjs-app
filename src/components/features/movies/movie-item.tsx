import { Text1 } from "@/components/texts";
import { endpoints } from "@/endpoints";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import { Box } from "@chakra-ui/react";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistance } from "date-fns";
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

export const MovieByIdExcerpt = ({
  accessToken,
  movieId,
}: {
  accessToken: string;
  movieId: number;
}) => {
  const { data: dataResult } = useQuery({
    queryKey: movieKeys.byId({ id: movieId }),
    queryFn: fetchMovieById(accessToken),
  });

  const data = dataResult?.data;

  return (
    <Box>
      {data ? (
        <Box>
          <SingleMovieSharedView movie={data} />
          <Text1>Actors:</Text1>
          {data.actors.map((actor) => (
            <Box key={actor.id} boxShadow="base" p="6" rounded="md">
              <Text1>{actor.name}</Text1>
              <GetDaysAgoText1 name="Created" dateIso={actor.createdAt} />
              <GetDaysAgoText1 name="Updated" dateIso={actor.updatedAt} />
            </Box>
          ))}
        </Box>
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
