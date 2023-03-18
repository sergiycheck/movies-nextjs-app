import { useForm } from "react-hook-form";
import { PasswordInput, RegisterData } from "./register";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Button1 } from "@/components/buttons";

export type LoginData = Pick<RegisterData, "email" | "password"> & {
  csrfToken: string;
};

export function Login({
  csrfToken,
  submitLoginForm,
}: {
  csrfToken: string | undefined;
  submitLoginForm: (data: LoginData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = handleSubmit((data) => submitLoginForm(data));

  return (
    <FormControl
      display="flex"
      flexDir="column"
      gap="1rem"
      as="form"
      onSubmit={onSubmit}
    >
      <Input
        type="hidden"
        defaultValue={csrfToken}
        {...register("csrfToken")}
      />

      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input {...register("email")} />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <PasswordInput label="password" register={register} required />
      </FormControl>

      <Flex justifyContent="end">
        <Button1 type="submit">Login</Button1>
      </Flex>
    </FormControl>
  );
}
