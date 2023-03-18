import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

export const Button1 = React.forwardRef(
  (
    props: {
      children: string | JSX.Element | any;
      other?: ButtonProps | undefined;
    },
    ref: React.Ref<HTMLButtonElement> | null
  ) => {
    return (
      <Button ref={ref} {...props.other}>
        {props.children}
      </Button>
    );
  }
);

Button1.displayName = "Button1";
