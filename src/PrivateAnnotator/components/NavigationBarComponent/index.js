import React, { useState, useEffect } from "react";
import {
  Center,
  Stack,
  Button,
  chakra,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function Navbar({ token }) {
  const navigate = useNavigate();
  const privateAnnotator = useSelector(
    (state) => state.privateAnnotator.privateAnnotator
  );

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <chakra.header padding="5">
      <Center justifyContent="space-between">
        <Stack direction="row" spacing="5">
          <Button
            variant="nav"
            onClick={() =>
              navigate(`/private-annotator/annotate?token=${token}`)
            }
          >
            Annotate
          </Button>
          <Button
            variant="nav"
            onClick={() =>
              navigate(
                `/private-annotator/completed-annotations?token=${token}`
              )
            }
          >
            Completed annotations
          </Button>
        </Stack>
        <Stack direction="row" spacing="5">
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          <Menu>
            <MenuButton as={Button}>
              @
              {privateAnnotator.contributor !== undefined
                ? privateAnnotator.contributor
                : null}
            </MenuButton>
            <MenuList>
              <MenuItem>Contact administrator</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Center>
    </chakra.header>
  );
}
