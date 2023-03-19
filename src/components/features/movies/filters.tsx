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

  const queryParams = useBoundMoviesStore(
    (store) => store.searchFilters.queryParams
  );

  const setQueryParams = useBoundMoviesStore(
    (store) => store.searchFilters.setQueryParams
  );

  let sort = queryParams.sort ?? "default";
  if (sort === "id") {
    sort = "default";
  }
  const order = queryParams.order ?? "ASC";
  const [search, setSearch] = React.useState("");

  return (
    <>
      <Flex gap={2} width="100%">
        <InputGroup>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQueryParams({ search });
              }
            }}
          />
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
              {`Sort by ${sort}`}
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setQueryParams({ sort: "id" });
                }}
              >
                Default
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setQueryParams({ sort: "title" });
                }}
              >
                Title
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setQueryParams({ sort: "year" });
                }}
              >
                Year
              </MenuItem>
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
              {`Order ${order}`}
            </MenuButton>
            <MenuList>
              <MenuItem
                height="10"
                display="flex"
                justifyContent="center"
                onClick={() => {
                  setQueryParams({ order: "ASC" });
                }}
              >
                <ArrowDownIcon transform="rotate(180deg)" />
                <Text1>ACS</Text1>
              </MenuItem>
              <MenuItem
                height="10"
                display="flex"
                justifyContent="center"
                onClick={() => {
                  setQueryParams({ order: "DESC" });
                }}
              >
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
