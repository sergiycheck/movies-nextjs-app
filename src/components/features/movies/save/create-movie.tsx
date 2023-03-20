import React from "react";
import {
  MovieById,
  movieKeys,
} from "@/components/features/movies/movies-fiied";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import { endpoints } from "@/endpoints";
import {
  CreateMovieReqPayload,
  EditActorType,
  SaveMovieMutationPayload,
} from "./types";
import { SaveMovieView } from "./save-movie-view";

export const createMovieMutationFn = async ({
  saveMovieBody,
  token,
}: CreateMovieReqPayload) => {
  const response = await axios.post<SuccessMoviesResponse<MovieById>>(
    endpoints.movies.name,
    saveMovieBody,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export function CreateMovie({ accessToken }: { accessToken: string }) {
  const [editingActors, setEditingActors] = React.useState<
    EditActorType[] | undefined
  >();

  const queryClient = useQueryClient();

  const createMovieMutation = useMutation({
    mutationFn: createMovieMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(movieKeys.lists());
    },
  });

  const editMovieMutationHandler = (args: SaveMovieMutationPayload) => {
    const { formData, editingActors } = args;

    const payload: CreateMovieReqPayload = {
      saveMovieBody: {
        ...formData,
        actors: editingActors.length
          ? editingActors.map((item) => item.name)
          : [],
      },
      token: accessToken,
    };

    createMovieMutation.mutate(payload);
  };

  return (
    <>
      <SaveMovieView
        dataToPassIntoForm={undefined}
        editingActors={editingActors}
        setEditingActors={setEditingActors}
        saveMovieMutationHandler={editMovieMutationHandler}
        data={undefined}
        isSuccess={createMovieMutation.isSuccess}
        isError={createMovieMutation.isError}
      />
    </>
  );
}
