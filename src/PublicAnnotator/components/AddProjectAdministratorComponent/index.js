import {
  Box,
  Stack,
  Text,
  Input,
  Button,
  TableContainer,
  TableCaption,
  Thead,
  Table,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Tooltip,
  useToast,
  Kbd,
} from "@chakra-ui/react";
import {
  createAdministrator,
  createCategory,
  deleteCategory,
  getProjectData,
} from "../../../features/public-annotator/thunk";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

export default function AddProjectAdministratorComponent() {
  const [administratorEmail, setAdministratorEmail] = useState("");
  const [administratorUsername, setAdministratorUsername] = useState("");

  const toast = useToast();
  const dispatch = useDispatch();

  const administrators = useSelector(
    (state) => state.publicAnnotator.communityProject.administrators
  );
  const projectURL = useSelector(
    (state) => state.publicAnnotator.communityProject.url
  );

  const submitAdministratorLogic = () => {
    if (administratorEmail === "")
      toast({
        title: "Missing new administrator email",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (administratorEmail === "") return;
    dispatch(createAdministrator([projectURL, administratorEmail])).then(
      (response) => {
        dispatch(getProjectData([projectURL])).then(() => {
          if (
            response.type === "public-annotator/createAdministrator/rejected"
          ) {
            toast({
              title: response.payload.detail,
              status: "error",
              duration: 3500,
              isClosable: true,
            });
            return;
          }
          toast({
            title: "New administrator added",
            status: "success",
            duration: 3500,
            isClosable: true,
          });
        });
      }
    );
  };

  if (administrators === undefined) {
    return <></>;
  }

  return (
    <>
      {" "}
      <Box w="100%">
        <Stack direction="row" w="100%" spacing={10}>
          <Stack w="30%" spacing={10}>
            <Text fontSize="3xl">Username</Text>
            <Input
              placeholder="Email"
              onChange={(event) => {
                setAdministratorEmail(event.target.value);
              }}
            />
            <Button onClick={submitAdministratorLogic}>
              Add administrator
            </Button>
          </Stack>
          <Stack w="70%">
            <TableContainer>
              <Table variant="simple">
                <TableCaption>Administrators</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    {/* <Th>Actions</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {administrators.map((administrator) => (
                    <Tr>
                      <Td>{administrator.username}</Td>
                      <Td>{administrator.email}</Td>
                      {/* <Td>
                        <Stack direction="row" spacing={5}>
                          <Tooltip
                            label="Delete Category"
                            aria-label="Delete Category"
                          >
                            <IconButton
                              aria-label="Delete Category"
                              icon={<CloseIcon />}
                              onClick={() => {
                                dispatch(
                                  deleteAdministrator([projectURL, administrator.usernam])
                                ).then((response) => {
                                  if (
                                    response.type ===
                                    "public-annotator/deleteCategory/rejected"
                                  ) {
                                    toast({
                                      title: response.payload.detail,
                                      status: "error",
                                      duration: 3500,
                                      isClosable: true,
                                    });
                                    return;
                                  }
                                  toast({
                                    title: "Category deleted",
                                    status: "success",
                                    duration: 3500,
                                    isClosable: true,
                                  });
                                });
                              }}
                            />
                          </Tooltip>
                        </Stack>
                      </Td> */}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
