import {
  Container,
  Box,
  Stack,
  Input,
  Center,
  Flex,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/NavigationBarComponent";

export default function SignUp() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Container>
        <Center>
          <Box w="100%">
            <Stack direction="column" spacing={5}>
              <Input placeholder="Email" type="email" />
              <Input placeholder="Password" type="password" />
              <Button>Sign Up</Button>
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
