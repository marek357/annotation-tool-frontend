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
import { isEmpty } from "react-redux-firebase";
import { useFirebase } from "react-redux-firebase";

export default function Navbar({ hideNavigation }) {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const auth = useSelector((state) => state.firebase.auth);
  const { colorMode, toggleColorMode } = useColorMode();
  const signOutLogic = () => firebase.logout().then(() => navigate("/sign-in"));
  return (
    <chakra.header padding="5">
      <Center justifyContent="space-between">
        <Stack direction="row" spacing="5">
          {!hideNavigation ? (
            <>
              <Button variant="nav" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button
                variant="nav"
                onClick={() => navigate("/community-projects")}
              >
                Browse Projects
              </Button>
              <Button variant="nav" onClick={() => navigate("/new-project")}>
                Create Project
              </Button>
              {!isEmpty(auth) ? (
                <Button variant="nav" onClick={() => navigate("/my-projects")}>
                  My Projects
                </Button>
              ) : null}
            </>
          ) : null}
        </Stack>
        <Stack direction="row" spacing="5">
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          {isEmpty(auth) ? (
            <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
          ) : (
            <Menu>
              <MenuButton as={Button}>@{auth.providerData[0].email}</MenuButton>
              <MenuList>
                <MenuItem onClick={signOutLogic}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </Center>
    </chakra.header>
  );
}
