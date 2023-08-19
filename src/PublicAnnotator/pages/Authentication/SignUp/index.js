import {
  Container,
  Box,
  Stack,
  Input,
  Center,
  Flex,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useFirebase } from "react-redux-firebase";
import Navbar from "../../../components/NavigationBarComponent";

export default function SignUp() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpLogic = () => {
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
      .createUser({ email, password }, { email, email })
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
              <Button onClick={signUpLogic}>Sign Up</Button>
              <Button variant="link" onClick={() => navigate("/sign-in")}>
                Already have an account? Sign In
              </Button>
            </Stack>
          </Box>
        </Center>
      </Container>
    </>
  );
}
