import React, { useState } from "react";
import Navbar from "../../components/NavigationBarComponent";
import {
  Alert,
  Center,
  Input,
  Select,
  Stack,
  AlertIcon,
  Text,
  AlertTitle,
  Button,
  useToast,
  AlertDescription,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "react-redux-firebase";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { createCommunityProject } from "../../../features/public-annotator/thunk";
import { useNavigate } from "react-router";

export default function CreateProject() {
  const auth = useSelector((state) => state.firebase.auth);
  const createdProjectURL = useSelector(
    (state) => state.publicAnnotator.createdProjectURL
  );
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Text Classification");
  const [characterLevelAnnotation, setCharacterLevelAnnotation] =
    useState(null);
  const modesOfAnnotation = [
    ["Text Classification", false],
    ["Machine Translation Adequacy", false],
    ["Machine Translation Fluency", false],
    ["Named Entity Recognition", false],
  ];

  const submitNewProject = () => {
    if (name === "")
      toast({
        title: "Project Title missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (description === "")
      toast({
        title: "Project Description missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (type === "")
      toast({
        title: "Project Type missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (
      (type === "Machine Translation Adequacy" ||
        type === "Machine Translation Fluency" ||
        type === "Named Entity Recognition") &&
      characterLevelAnnotation === null
    )
      toast({
        title: "Character Level vs Word Level selection missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (
      name === "" ||
      description === "" ||
      type === "" ||
      ((type === "Machine Translation Adequacy" ||
        type === "Machine Translation Fluency" ||
        type === "Named Entity Recognition") &&
        characterLevelAnnotation === null)
    )
      return;
    if (isEmpty(auth)) {
      toast({
        title: "Contributor not authorised",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
      return;
    }
    dispatch(
      createCommunityProject([
        name,
        description,
        type,
        characterLevelAnnotation,
      ])
    ).then((response) => {
      if (
        response.type === "public-annotator/createCommunityProject/fulfilled"
      ) {
        navigate(`/project/${response.payload.url}`);
      } else {
        toast({
          title: response.error.message,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      {isEmpty(auth) ? (
        // https://chakra-ui.com/docs/components/alert
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>You're not authenticated!</AlertTitle>
          <AlertDescription>
            To create a new dataset you need to be authenticated so that we can
            make you the project administrator
          </AlertDescription>
        </Alert>
      ) : null}
      <Center>
        <Stack textAlign="center" paddingTop="10">
          <Text fontSize="3xl" fontFamily="Lato">
            Create a new project
          </Text>
          <Text fontSize="2xl" fontFamily="Lato">
            We're very excited to start this new adventure with you!
          </Text>
          <Input
            placeholder="Project Name"
            onChange={(event) => setName(event.target.value)}
          />
          <MDEditor
            value={description}
            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            onChange={setDescription}
          />
          <Select onChange={(event) => setType(event.target.value)}>
            {modesOfAnnotation.map((mode) => (
              <option disabled={mode[1]}>{mode[0]}</option>
            ))}
          </Select>
          {type === "Machine Translation Adequacy" ||
          type === "Machine Translation Fluency" ||
          type === "Named Entity Recognition" ? (
            <>
              <RadioGroup
                onChange={(event) => setCharacterLevelAnnotation(event)}
                // defaultValue={characterLevelAnnotation}
              >
                <Stack>
                  <Radio value={"false"}>Word Level Annotation</Radio>
                  <Radio value={"true"}>Character Level Annotation</Radio>
                </Stack>
              </RadioGroup>
            </>
          ) : null}
          <Button
            textTransform="capitalize"
            isDisabled={isEmpty(auth)}
            onClick={submitNewProject}
          >
            Create a new project
          </Button>
          <Text fontSize="md" fontFamily="Lato" align="center">
            Built for people who care, just like you &#10084;&#65039;
          </Text>
        </Stack>
      </Center>
    </>
  );
}
