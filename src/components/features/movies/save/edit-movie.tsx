import React from "react";
import { fetchMovieById } from "@/components/features/movies/movie-item";
import {
  MovieById,
  movieKeys,
} from "@/components/features/movies/movies-fiied";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import { endpoints } from "@/endpoints";
import {
  EditActorType,
  EditMoVieByIdArgType,
  EditMovieMutationPayload,
} from "./types";
import { SaveMovieView } from "./save-movie-view";

export const editMovieById = async ({
  editActorBody,
  token,
  id,
}: EditMoVieByIdArgType) => {
  const response = await axios.patch<SuccessMoviesResponse<MovieById>>(
    endpoints.movies.byId(`${id}`),
    editActorBody,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export function EditMovie({
  movieId,
  accessToken,
}: {
  movieId: number;
  accessToken: string;
}) {
  const { data: dataResult } = useQuery({
    queryKey: movieKeys.byId({ id: movieId }),
    queryFn: fetchMovieById(accessToken),
  });

  const data = dataResult?.data;

  const dataToPassIntoForm = React.useMemo(() => {
    if (data) {
      const { actors, ...dataToPassIntoForm } = data;
      return dataToPassIntoForm;
    }
  }, [data]);

  const [editingActors, setEditingActors] = React.useState<
    EditActorType[] | undefined
  >();

  React.useEffect(() => {
    if (data && data?.actors && data.actors.length) {
      setEditingActors(() => [
        ...data?.actors.map((actor) => ({
          name: actor.name,
          uniqueId: uuidv4(),
        })),
      ]);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const editMovieByIdMutation = useMutation({
    mutationFn: editMovieById,
    onSuccess: (data) => {
      queryClient.invalidateQueries(movieKeys.lists());
    },
  });

  const editMovieMutationHandler = (args: EditMovieMutationPayload) => {
    const { formData, editingActors } = args;

    const payload = {
      editActorBody: {
        ...formData,
        actors: editingActors.length
          ? editingActors.map((item) => item.name)
          : [],
      },
      token: accessToken,
      id: dataToPassIntoForm!.id,
    };

    editMovieByIdMutation.mutate(payload);
  };

  return (
    <>
      <SaveMovieView
        dataToPassIntoForm={dataToPassIntoForm}
        editingActors={editingActors}
        setEditingActors={setEditingActors}
        saveMovieMutationHandler={editMovieMutationHandler}
        data={data}
        isSuccess={editMovieByIdMutation.isSuccess}
        isError={editMovieByIdMutation.isError}
      />
    </>
  );
}
