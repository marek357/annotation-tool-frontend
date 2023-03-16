import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Center,
  Stack,
  Text,
  CardHeader,
  CardBody,
  StackDivider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import {
  uploadUnannotatedFile,
  getUnannotatedData,
} from "../../../features/public-annotator/thunk";

export default function ImportUnannotatedData({ projectURL, projectType }) {
  const [textField, setTextField] = useState("");
  const [csvDelimiter, setCSVDelimiter] = useState("");
  const [contextField, setContextField] = useState("");
  const [preannotationField, setPreannotationField] = useState("");
  const [machineTranslationField, setMachineTranslationField] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  // https://react-dropzone.org/#!/Examples
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ maxFiles: 1 });

  useEffect(() => {
    if (acceptedFiles.length === 0) {
      setTextField("");
      setCSVDelimiter("");
      setContextField("");
      setPreannotationField("");
      setMachineTranslationField("");
    }
  }, [acceptedFiles]);

  const uploadFileLogic = () => {
    if (textField === "")
      toast({
        title: "Text Field missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (acceptedFiles[0].type === "text/csv" && csvDelimiter === "")
      toast({
        title: "CSV Delimiter missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });

    if (
      projectType === "Machine Translation Adequacy" &&
      machineTranslationField === ""
    )
      toast({
        title: "Machine Translation Field missing",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    if (
      textField === "" ||
      (acceptedFiles[0].type === "text/csv" && csvDelimiter === "") ||
      (projectType === "Machine Translation Adequacy" &&
        machineTranslationField === "")
    )
      return;

    var uploadUnannotatedFileRequestParameters = {};
    uploadUnannotatedFileRequestParameters["text_field"] = textField;
    if (contextField != "")
      uploadUnannotatedFileRequestParameters["context_field"] = contextField;
    if (preannotationField != "")
      uploadUnannotatedFileRequestParameters["value_field"] =
        preannotationField;
    if (csvDelimiter != "")
      uploadUnannotatedFileRequestParameters["csv_delimiter"] = csvDelimiter;
    if (machineTranslationField != "")
      uploadUnannotatedFileRequestParameters["mt_system_translation"] =
        machineTranslationField;
    // https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios
    const stringUploadUnannotatedFileRequestSearchParameters =
      new URLSearchParams(uploadUnannotatedFileRequestParameters).toString();
    const uploadUnannotatedFileRequestFormData = new FormData();
    uploadUnannotatedFileRequestFormData.append(
      "unannotated_data_file",
      acceptedFiles[0]
    );
    dispatch(
      uploadUnannotatedFile([
        projectURL,
        uploadUnannotatedFileRequestFormData,
        stringUploadUnannotatedFileRequestSearchParameters,
      ])
    ).then((response) => {
      setTextField("");
      setCSVDelimiter("");
      setContextField("");
      setPreannotationField("");
      setMachineTranslationField("");
      acceptedFiles.length = 0;
      if (response.status.split("/")[2] === "fulfilled") {
        toast({
          title: "Data File Uploaded",
          status: "success",
          duration: 3500,
          isClosable: true,
        });
        dispatch(getUnannotatedData(projectURL));
      } else {
        toast({
          title: `${response.error.message}`,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      }
    });
  };

  const gatherUploadedDataDetails = () => {
    return (
      <>
        <Stack>
          {/* https://chakra-ui.com/docs/components/form-control */}
          <FormControl isRequired>
            <FormLabel>
              {projectType === "Machine Translation Adequacy"
                ? "System Translation Field"
                : "Text Field"}
            </FormLabel>
            <Input onChange={(event) => setTextField(event.target.value)} />
            <FormHelperText>
              Name of column or key in the data file storing text data
            </FormHelperText>
          </FormControl>
          {acceptedFiles.length > 0 && acceptedFiles[0].type === "text/csv" ? (
            <FormControl isRequired>
              <FormLabel>CSV Delimiter Field</FormLabel>
              <Input
                onChange={(event) => setCSVDelimiter(event.target.value)}
              />
              <FormHelperText>
                Delimiter symbol separating data in the CSV file
              </FormHelperText>
            </FormControl>
          ) : null}
          {projectType === "Machine Translation Adequacy" ? (
            <FormControl isRequired>
              <FormLabel>Reference translation</FormLabel>
              <Input
                onChange={(event) =>
                  setMachineTranslationField(event.target.value)
                }
              />
              <FormHelperText>
                Ground truth translation not coming from the evaluated MT system
              </FormHelperText>
            </FormControl>
          ) : null}
          <FormControl>
            <FormLabel>Context Field</FormLabel>
            <Input onChange={(event) => setContextField(event.target.value)} />
            <FormHelperText>
              Name of column or key in the data file storing context data,
              annotators will see to suplement the annotated text
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Preannotation Field</FormLabel>
            <Input
              onChange={(event) => setPreannotationField(event.target.value)}
            />
            <FormHelperText>
              Name of column or key in the data file storing preannotation data,
              which the annotators will see and will be able to either agree
              with or modify
            </FormHelperText>
          </FormControl>
          <Button onClick={uploadFileLogic}>Submit</Button>
        </Stack>
      </>
    );
  };

  // https://react-dropzone.org/#!/Examples
  const files = () =>
    acceptedFiles.map((file) => (
      <>
        {/* https://chakra-ui.com/docs/components/card */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">
              File to be uploaded
            </Text>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="5">
              <Stack>
                <Text
                  fontWeight="bold"
                  fontSize="1xl"
                  textTransform="uppercase"
                >
                  Name
                </Text>
                <Text>{file.name}</Text>
              </Stack>
              <Stack>
                <Text
                  fontWeight="bold"
                  fontSize="1xl"
                  textTransform="uppercase"
                >
                  Size
                </Text>
                <Text>{(file.size * 1e-6).toFixed(4)} Mb </Text>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </>
    ));

  // https://react-dropzone.org/#!/Examples
  return (
    <>
      <Box>
        <Center>
          <Stack>
            <Box
              backgroundColor={
                acceptedFiles.length === 0
                  ? colorMode === "light"
                    ? "gray.100"
                    : "gray.700"
                  : colorMode === "light"
                  ? "green.100"
                  : "green.700"
              }
              padding="10"
              textAlign="center"
            >
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <Text fontFamily="Lato" fontSize="2xl">
                  {acceptedFiles.length === 0
                    ? "Drag 'n' drop some files here"
                    : "Click to remove the file"}
                </Text>
              </div>
            </Box>
            {acceptedFiles.length > 0 ? files() : null}
            {acceptedFiles.length > 0 ? gatherUploadedDataDetails() : null}
          </Stack>
        </Center>
      </Box>
    </>
  );
}
