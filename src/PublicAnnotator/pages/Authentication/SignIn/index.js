import {
  Container,
  Box,
  Stack,
  Input,
  Center,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useFirebase } from "react-redux-firebase";
import Navbar from "../../../components/NavigationBarComponent";
export default function SignIn() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInLogic = () => {
    if (email === "")
      toast({
        title: "Email missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (password === "")
      toast({
        title: "Password missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (email === "" || password === "") return;

    firebase
      .login({ email, password })
      .then(() => navigate("/"))
      .catch((error) =>
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3500,
          isClosable: true,
        })
      );
  };

  return (
    <>
      <Navbar />
      <Container>
        <Center>
          <Box w="100%">
            <Stack direction="column" spacing={5}>
              <Input
                placeholder="Email"
                type="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
              <Input
                placeholder="Password"
                type="password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <Button onClick={signInLogic}>Sign In</Button>
              <Button variant="link" onClick={() => navigate("/sign-up")}>
                Don't have an account? Sign Up
              </Button>
            </Stack>
          </Box>
        </Center>
      </Container>
    </>
  );
}
