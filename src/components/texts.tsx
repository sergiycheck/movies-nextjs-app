import { ComponentWithAs, Text, TextProps } from "@chakra-ui/react";

export const Text1: ComponentWithAs<"p", TextProps> = (props) => {
  const { children, ...propsToPass } = props;
  return (
    <Text fontSize="sm" {...propsToPass}>
      {children}
    </Text>
  );
};

export const Title1: ComponentWithAs<"p", TextProps> = (props) => {
  const { children, ...propsToPass } = props;
  return (
    <Text fontSize="3xl" as="h1" {...propsToPass}>
      {children}
    </Text>
  );
};
