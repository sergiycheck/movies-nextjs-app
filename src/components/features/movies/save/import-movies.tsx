import { Button1 } from "@/components/buttons";
import { Text1 } from "@/components/texts";
import { endpoints } from "@/endpoints";
import { SuccessMoviesResponse } from "@/pages/api/auth/[...nextauth]";
import { Box, FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Movie } from "../movies-fiied";

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = React.useState(false);

  const [fileName, setFileName] = React.useState("");

  const handleFile = (files: FileList) => {
    console.log(files);

    const file = files[0];

    setFileName(file.name);
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

  return (
    <Box width="100%" height="100%">
      <Text1>Importing movies</Text1>

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
        onSubmit={(e) => e.preventDefault()}
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

        <Button1 onClick={() => onButtonClick()}>Upload</Button1>

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
    </Box>
  );
}
