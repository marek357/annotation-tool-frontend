import { CheckIcon, CloseIcon, CopyIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  Stack,
  TableContainer,
  Text,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Box,
  SkeletonText,
  Td,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrivateAnnotators,
  createPrivateAnnotator,
  resendPrivateAnnotatorInvitation,
  togglePrivateAnnotatorStatus,
} from "../../../features/public-annotator/thunk";

export default function ManagePrivateAnnotatorsComponent({ projectURL }) {
  const [loading, setLoading] = useState(true);
  const [privateAnnotatorUsername, setPrivateAnnotatorUsername] = useState("");
  const [privateAnnotatorEmail, setPrivateAnnotatorEmail] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();
  const privateAnnotators = useSelector(
    (state) => state.publicAnnotator.privateAnnotators
  );
  const auth = useSelector((state) => state.firebase.auth);
  const loaded = useSelector(
    (state) => state.publicAnnotator.privateAnnotatorsLoaded
  );

  const testingURL = "http://localhost:3000";
  const deploymentURL = "https://annopedia.marekmasiak.tech";
  const testing = true;

  const createPrivateAnnotatorLogic = () => {
    if (privateAnnotatorUsername === "")
      toast({
        title: "Username missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (privateAnnotatorEmail === "")
      toast({
        title: "Email missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });

    if (privateAnnotatorUsername === "" || privateAnnotatorEmail === "") return;
    dispatch(
      createPrivateAnnotator([
        projectURL,
        privateAnnotatorEmail,
        privateAnnotatorUsername,
      ])
    ).then(() => {
      toast({
        title: "Private annotator created",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
    });
  };

  const loadingCard = () => (
    // https://chakra-ui.com/docs/components/skeleton/usage
    <>
      <Box padding="5" boxShadow="lg">
        <SkeletonText mt="5" noOfLines={5} spacing="4" skeletonHeight="3" />
      </Box>
    </>
  );

  useEffect(() => {
    dispatch(getPrivateAnnotators([projectURL])).then(() => {
      setLoading(false);
    });
  }, [auth]);

  if (loading) {
    return (
      <Box w="100%">
        <Stack direction="row">
          <Stack>
            <Text fontSize="3xl">New private annotator</Text>
            <Input placeholder="Username" type="username" />
            <Input placeholder="Email" type="email" />
            <Button>Add private annotator</Button>
          </Stack>
          <Stack>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>Private annotators</TableCaption>
                <Thead>
                  <Tr>
                    <Th>username</Th>
                    <Th>email</Th>
                    <Th>completion</Th>
                    <Th>action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{loadingCard()}</Td>
                    <Td>{loadingCard()}</Td>
                    <Td>{loadingCard()}</Td>
                    <Td>{loadingCard()}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box w="100%">
      <Stack direction="row" w="100%" spacing={10}>
        <Stack w="30%" spacing={10}>
          <Text fontSize="3xl">New private annotator</Text>
          <Input
            placeholder="Username"
            type="username"
            onChange={(event) =>
              setPrivateAnnotatorUsername(event.target.value)
            }
          />
          <Input
            placeholder="Email"
            type="email"
            onChange={(event) => setPrivateAnnotatorEmail(event.target.value)}
          />
          <Button onClick={createPrivateAnnotatorLogic}>
            Add private annotator
          </Button>
        </Stack>
        <Stack w="70%">
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Private annotators</TableCaption>
              <Thead>
                <Tr>
                  <Th>username</Th>
                  <Th>email</Th>
                  <Th>completion</Th>
                  <Th>action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {privateAnnotators.map((privateAnnotator) => (
                  <Tr>
                    <Td as={privateAnnotator.is_active ? "" : "s"}>
                      {privateAnnotator.contributor}
                    </Td>
                    <Td as={privateAnnotator.is_active ? "" : "s"}>
                      {privateAnnotator.email}
                    </Td>
                    <Td as={privateAnnotator.is_active ? "" : "s"}>
                      {privateAnnotator.completion}%
                    </Td>
                    <Td>
                      {/* https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard */}
                      <Stack direction="row" spacing={5}>
                        <Tooltip
                          label="Copy Private Annotator URL"
                          aria-label="Copy Private Annotator URL"
                        >
                          <IconButton
                            aria-label="Copy Private Annotator URL"
                            icon={<CopyIcon />}
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${
                                  testing ? testingURL : deploymentURL
                                }/private-annotator/annotate?token=${
                                  privateAnnotator.token
                                }`
                              )
                            }
                            disabled={!privateAnnotator.is_active}
                          />
                        </Tooltip>
                        <Tooltip
                          label="Resend Email invitation"
                          aria-label="Resend Email invitation"
                        >
                          <IconButton
                            aria-label="Resend Email invitation"
                            icon={<EmailIcon />}
                            disabled={!privateAnnotator.is_active}
                            onClick={() =>
                              dispatch(
                                resendPrivateAnnotatorInvitation([
                                  projectURL,
                                  privateAnnotator.token,
                                ])
                              )
                            }
                          />
                        </Tooltip>
                        {privateAnnotator.is_active ? (
                          <Tooltip
                            label="Disable Private Annotator"
                            aria-label="Disable Private Annotator"
                          >
                            <IconButton
                              aria-label="Disable Private Annotator"
                              icon={<CloseIcon />}
                              onClick={() =>
                                dispatch(
                                  togglePrivateAnnotatorStatus([
                                    projectURL,
                                    privateAnnotator.token,
                                    false,
                                  ])
                                )
                              }
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            label="Enable Private Annotator"
                            aria-label="Enable Private Annotator"
                          >
                            <IconButton
                              aria-label="Enable Private Annotator"
                              icon={<CheckIcon />}
                              onClick={() =>
                                dispatch(
                                  togglePrivateAnnotatorStatus([
                                    projectURL,
                                    privateAnnotator.token,
                                    true,
                                  ])
                                )
                              }
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </Box>
  );
}
