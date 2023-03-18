import { Button1 } from "@/components/buttons";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
import { FieldValues, Path, useForm, UseFormRegister } from "react-hook-form";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SubmitRegisterFormData = RegisterData & { csrfToken: string };

export type LoginResponse = {
  token: string;
  status: number;
};

export function Register({
  csrfToken,
  submitLoginForm,
}: {
  csrfToken: string | undefined;
  submitLoginForm: (data: SubmitRegisterFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitRegisterFormData>();

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
        <FormLabel>Name</FormLabel>
        <Input {...register("name")} />
      </FormControl>

      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input {...register("email")} />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <PasswordInput label="password" register={register} required />
      </FormControl>

      <FormControl>
        <FormLabel>Confirm password</FormLabel>
        <PasswordInput label="confirmPassword" register={register} required />
      </FormControl>

      <Flex justifyContent="end">
        <Button1 type="submit">Register</Button1>
      </Flex>
    </FormControl>
  );
}

type PasswordInputProps<FormDataType extends FieldValues> = {
  label: Path<FormDataType>;
  register: UseFormRegister<FormDataType>;
  required: boolean;
};

export function PasswordInput<FormDataType extends FieldValues>(
  props: PasswordInputProps<FormDataType>
) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        {...props.register(props.label, { required: props.required })}
      />
      <InputRightElement width="4.5rem">
        <Button1 h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button1>
      </InputRightElement>
    </InputGroup>
  );
}
