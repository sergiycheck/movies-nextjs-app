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

  const resetAndSetFilter = () => {
    resetQueryParams();
    return (callBack: Function, args: any) => {
      callBack.call(undefined, args);
    };
  };

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
                if (!search) return;
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
                  resetAndSetFilter()(setQueryParams, { sort: "id" });
                }}
              >
                Default
              </MenuItem>
              <MenuItem
                onClick={() => {
                  resetAndSetFilter()(setQueryParams, { sort: "title" });
                }}
              >
                Title
              </MenuItem>
              <MenuItem
                onClick={() => {
                  resetAndSetFilter()(setQueryParams, { sort: "year" });
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
                  resetAndSetFilter()(setQueryParams, { order: "ASC" });
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
                  resetAndSetFilter()(setQueryParams, { order: "DESC" });
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
