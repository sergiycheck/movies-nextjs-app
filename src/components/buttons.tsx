import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

export const Button1 = React.forwardRef(
  (
    props: ButtonProps | (undefined & { children: JSX.Element | string }),
    ref: React.Ref<HTMLButtonElement> | null
  ) => {
    const { children, ...attrs } = props;
    return (
      <Button ref={ref} {...attrs}>
        {children}
      </Button>
    );
  }
);

Button1.displayName = "Button1";