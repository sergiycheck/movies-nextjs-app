import { Text } from "@chakra-ui/react";

export function Text1({ children }: { children: string }) {
  return <Text fontSize="sm">{children}</Text>;
}

export function Title1({ children }: { children: string }) {
  return (
    <Text fontSize="3xl" as="h1">
      {children}
    </Text>
  );
}
