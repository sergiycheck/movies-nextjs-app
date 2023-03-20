import React from "react";
import { MovieById } from "@/components/features/movies/movies-fiied";
import { Text1, Title1 } from "@/components/texts";
import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { Button1 } from "@/components/buttons";
import { v4 as uuidv4 } from "uuid";

import {
  EditActorType,
  EditMovieMutationPayload,
  MovieByIdOmitActors,
  SaveMovieType,
} from "./types";

export const SaveMovieView = (props: {
  dataToPassIntoForm: MovieByIdOmitActors | undefined;

  editingActors: EditActorType[] | undefined;
  setEditingActors: React.Dispatch<
    React.SetStateAction<EditActorType[] | undefined>
  >;

  saveMovieMutationHandler: (payload: EditMovieMutationPayload) => void;

  data: MovieById | undefined;

  isSuccess: boolean;
  isError: boolean;
}) => {
  const {
    data,
    dataToPassIntoForm,
    editingActors,
    setEditingActors,
    saveMovieMutationHandler,
    isSuccess,
    isError,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveMovieType>({
    values: dataToPassIntoForm,
    resetOptions: { keepDirtyValues: true },
  });

  const [newActorName, setNewActorName] = React.useState("");

  const onSubmit = handleSubmit((formData) => {
    if (!formData || !editingActors) return;

    saveMovieMutationHandler({ formData, editingActors });
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

      {isSuccess && (
        <Alert status="success">
          <AlertIcon />
          Data is updated!
        </Alert>
      )}

      {isError && (
        <Alert status="error">
          <AlertIcon />
          Something went wrong!
        </Alert>
      )}
    </Flex>
  );
};
