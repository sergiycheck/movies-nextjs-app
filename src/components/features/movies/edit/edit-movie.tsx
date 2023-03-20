import React from "react";
import { fetchMovieById } from "@/components/features/movies/movie-item";
import { Actor, movieKeys } from "@/components/features/movies/movies-fiied";
import { Text1, Title1 } from "@/components/texts";
import { Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { Button1 } from "@/components/buttons";
import z from "zod";
import { v4 as uuidv4 } from "uuid";

export const EditMovieSchema = z.object({
  title: z.string().min(0).max(100),
  year: z.number().min(0).max(11000),
  format: z.string().min(0).max(100),
});

export type EditMovieType = z.infer<typeof EditMovieSchema>;

export const actorsArrSchema = z.object({
  actors: z.array(z.string()),
});
export type EditActorType = Pick<Actor, "name"> & {
  uniqueId: string;
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

  const [newActorName, setNewActorName] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditMovieType>({
    values: dataToPassIntoForm,
    resetOptions: { keepDirtyValues: true },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    console.log(editingActors);
  });

  return (
    <Flex gap={2} flexDir="column">
      <Title1>{`Editing movie ${data?.title}`}</Title1>

      <FormControl
        display="flex"
        flexDir="column"
        gap="1rem"
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input {...register("title")} />
        </FormControl>
        <FormControl>
          <FormLabel>Year</FormLabel>
          <Input {...register("year")} />
        </FormControl>
        <FormControl>
          <FormLabel>Format</FormLabel>
          <Input {...register("format")} />
        </FormControl>

        <FormControl display="flex" gap={2} flexDir="column">
          <FormLabel margin={0}>Edit actors</FormLabel>
          <Flex gap={2}>
            <Input
              value={newActorName}
              onChange={(e) => setNewActorName(e.target.value)}
            />
            <Button1
              onClick={() => {
                if (!newActorName) return;

                setEditingActors((prev) => [
                  ...prev!,
                  { uniqueId: uuidv4(), name: newActorName },
                ]);

                setNewActorName("");
              }}
            >
              Add
            </Button1>
          </Flex>

          <Text1>Actors:</Text1>
          <Flex gap={2} flexDir="column">
            {editingActors?.map((actor) => (
              <Flex
                key={actor.uniqueId}
                justifyContent="space-between"
                paddingTop={2}
                paddingBottom={2}
              >
                <Text1>{actor.name}</Text1>
                <Button1
                  onClick={() => {
                    setEditingActors((prev) =>
                      prev!.filter((item) => item.uniqueId !== actor.uniqueId)
                    );
                  }}
                >
                  Remove
                </Button1>
              </Flex>
            ))}
          </Flex>
        </FormControl>

        <Flex justifyContent="end">
          <Button1 type="submit">Save</Button1>
        </Flex>
      </FormControl>
    </Flex>
  );
}
