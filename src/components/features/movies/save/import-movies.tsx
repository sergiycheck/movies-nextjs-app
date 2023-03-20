import { Button1 } from "@/components/buttons";
import { Text1 } from "@/components/texts";
import { endpoints } from "@/endpoints";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Movie, movieKeys } from "../movies-fiied";

export type ImportMoviesReqPayload = {
  token: string;
  formData: FormData;
};

export const importMoviesMutationFn = async ({
  formData,
  token,
}: ImportMoviesReqPayload) => {
  const response = await axios.post<SuccessMoviesResponse<Movie[]>>(
    endpoints.movies.import,
    formData,
    {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export function ImportMovies({ accessToken }: { accessToken: string }) {
  const queryClient = useQueryClient();

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const importMovieMutation = useMutation({
    mutationFn: importMoviesMutationFn,
    onSuccess: (data) => {
      if (data.status) {
        setIsSuccess(true);
        setIsError(false);
        queryClient.invalidateQueries(movieKeys.lists());
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
    },
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = React.useState(false);

  const [fileName, setFileName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const handleFile = (files: FileList) => {
    const file = files[0];

    setFileName(file.name);
    setFile(file);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = function (
    e
  ) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const handleDrag: React.DragEventHandler<HTMLDivElement> = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  const onButtonClick = () => {
    inputRef?.current?.click();
  };

  const summitFormHandler = () => {
    const formData = new FormData();
    formData.append("movies", file as Blob);

    importMovieMutation.mutate({
      token: accessToken,
      formData,
    });
  };

  return (
    <Flex width="100%" height="100%" flexDir="column" gap={2}>
      <Text1>
        Select text file with only txt extention and approprited format
      </Text1>

      <FormControl
        position="relative"
        //
        width="100%"
        height="100%"
        border="1px"
        borderColor="gray.600"
        borderRadius={10}
        //
        display="flex"
        flexDir="column"
        gap={4}
        justifyContent="center"
        alignItems="center"
        //
        as="form"
        onDragEnter={handleDrag}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          ref={inputRef}
          type="file"
          multiple={false}
          display="none"
          onChange={handleChange}
        />

        {fileName ? (
          <Text1>{`Selected file ${fileName}`}</Text1>
        ) : (
          <Text1>Drag and drop filed here</Text1>
        )}

        <Button1 onClick={() => onButtonClick()}>Select file</Button1>

        {dragActive && (
          <Box
            position="absolute"
            width="100%"
            height="100%"
            top={0}
            right={0}
            left={0}
            bottom={0}
            //
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></Box>
        )}
      </FormControl>

      <Flex justifyContent="end">
        <Button1
          onClick={() => {
            summitFormHandler();
          }}
        >
          Save
        </Button1>
      </Flex>

      {isSuccess && (
        <Alert status="success">
          <AlertIcon />
          Movies was imported!
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
}
