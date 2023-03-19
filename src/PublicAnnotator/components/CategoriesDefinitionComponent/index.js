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
  createCategory,
  deleteCategory,
} from "../../../features/public-annotator/thunk";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

export default function CategoriesDefinitionComponent({ showKeyBinding }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryKeyBinding, setCategoryKeyBinding] = useState("");
  const [keyBindingActive, setKeyBindingActive] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.publicAnnotator.categories);
  const projectURL = useSelector(
    (state) => state.publicAnnotator.communityProject.url
  );

  const submitCategoryLogic = () => {
    if (categoryName === "")
      toast({
        title: "Missing new category name",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (categoryDescription === "")
      toast({
        title: "Missing new category description",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (showKeyBinding && categoryKeyBinding === "")
      toast({
        title: "Missing new category key binding",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    console.log(categoryName, categoryDescription, categoryKeyBinding);
    if (
      categoryName === "" ||
      categoryDescription === "" ||
      (showKeyBinding && categoryKeyBinding === "")
    )
      return;
    dispatch(
      createCategory([
        projectURL,
        categoryName,
        categoryDescription,
        categoryKeyBinding,
      ])
    ).then((response) => {
      if (response.type === "public-annotator/createCategory/rejected") {
        toast({
          title: response.payload.detail,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "New category created",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
    });
  };

  // https://usehooks.com/useKeyPress/
  const handleKeyDown = useCallback(
    async (event) => {
      if (!keyBindingActive) return;
      setCategoryKeyBinding(event.key);
    },
    [keyBindingActive, categoryKeyBinding]
  );

  const handleKeyUp = useCallback(async (event) => {}, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      {" "}
      <Box w="100%">
        <Stack direction="row" w="100%" spacing={10}>
          <Stack w="30%" spacing={10}>
            <Text fontSize="3xl">New category</Text>
            <Input
              placeholder="Category name"
              onChange={(event) => {
                setCategoryName(event.target.value);
              }}
            />
            <Input
              placeholder="Brief description"
              onChange={(event) => {
                setCategoryDescription(event.target.value);
              }}
            />
            {showKeyBinding ? (
              <>
                <Stack direction="row">
                  <Input
                    placeholder="Key binding"
                    isDisabled
                    value={categoryKeyBinding}
                  />
                  <Button
                    onClick={() => setKeyBindingActive(!keyBindingActive)}
                  >
                    {keyBindingActive ? "STOP" : "START"}
                  </Button>
                </Stack>
              </>
            ) : null}
            <Button onClick={submitCategoryLogic}>Add category</Button>
          </Stack>
          <Stack w="70%">
            <TableContainer>
              <Table variant="simple">
                <TableCaption>Categories</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    {showKeyBinding ? <Th>Key Binding</Th> : null}
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {categories !== undefined
                    ? categories.map((category) => (
                        <Tr>
                          <Td>{category.name}</Td>
                          <Td>{category.description}</Td>
                          {showKeyBinding ? (
                            <Td>
                              <Kbd>{category.key_binding}</Kbd>
                            </Td>
                          ) : null}
                          <Td>
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
                                      deleteCategory([projectURL, category.id])
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
                          </Td>
                        </Tr>
                      ))
                    : null}
                </Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
