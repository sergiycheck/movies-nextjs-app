import { useColorMode } from "@chakra-ui/react";
import { Button1 } from "./buttons";

export const ColorModeToggler = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button1 other={{ onClick: toggleColorMode }}>
      Toggle {colorMode === "light" ? "Dark" : "Light"}
    </Button1>
  );
};
