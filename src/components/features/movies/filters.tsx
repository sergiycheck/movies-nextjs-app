import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import React from "react";
import { Button1 } from "@/components/buttons";

import { ArrowDownIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Text1 } from "@/components/texts";
import { useBoundMoviesStore } from "../store/store";

export function MoviesFilters() {
  const resetQueryParams = useBoundMoviesStore(
    (store) => store.searchFilters.resetQueryParams
  );

  return (
    <>
      <Flex gap={2} width="100%">
        <InputGroup>
          <Input placeholder="Search" />
          <InputRightElement>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>

        <Button1
          onClick={() => {
            resetQueryParams();
          }}
        >
          Reset
        </Button1>
      </Flex>

      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              width="250px"
              isActive={isOpen}
              as={Button1}
              rightIcon={<ChevronDownIcon />}
            >
              {isOpen ? "Sorting close" : "Sorting open"}
            </MenuButton>
            <MenuList>
              <MenuItem>Default</MenuItem>
              <MenuItem>Title</MenuItem>
              <MenuItem>Year</MenuItem>
            </MenuList>
          </>
        )}
      </Menu>

      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              width="250px"
              isActive={isOpen}
              as={Button1}
              rightIcon={<ChevronDownIcon />}
            >
              {isOpen ? "Order close" : "Order open"}
            </MenuButton>
            <MenuList>
              <MenuItem height="10" display="flex" justifyContent="center">
                <ArrowDownIcon transform="rotate(180deg)" />
                <Text1>ACS</Text1>
              </MenuItem>
              <MenuItem height="10" display="flex" justifyContent="center">
                <ArrowDownIcon />
                <Text1>DESC</Text1>
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    </>
  );
}
