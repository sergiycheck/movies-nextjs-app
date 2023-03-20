import { Actor, MovieById } from "@/components/features/movies/movies-fiied";

import z from "zod";

export const SaveMovieSchema = z.object({
  title: z.string().min(0).max(100),
  year: z.number().min(0).max(11000),
  format: z.string().min(0).max(100),
});

export type SaveMovieType = z.infer<typeof SaveMovieSchema>;

export const actorsArrSchema = z.object({
  actors: z.array(z.string()),
});

export type EditActorType = Pick<Actor, "name"> & {
  uniqueId: string;
};

export type SaveMovieReqBody = SaveMovieType & {
  actors: string[];
};

export type EditMoVieByIdArgType = {
  editActorBody: SaveMovieReqBody;
  id: number;
  token: string;
};

export type MovieByIdOmitActors = Omit<MovieById, "actors">;

export type EditMovieMutationPayload = {
  formData: SaveMovieType;
  editingActors: EditActorType[];
};
