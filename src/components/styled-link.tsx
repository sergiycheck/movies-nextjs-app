import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { Text1 } from "./texts";

export function StyledLink({
  children,
  href,
}: {
  children: string;
  href: string;
}) {
  return (
    <Link
      as={NextLink}
      textStyle="a"
      href={href}
      _hover={{ textDecoration: "none" }}
    >
      <Text1>{children}</Text1>
    </Link>
  );
}
