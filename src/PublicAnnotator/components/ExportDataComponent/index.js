import {
  Stack,
  Card,
  LinkOverlay,
  CardHeader,
  Text,
  CardBody,
  Center,
  Code,
  Box,
  useColorMode,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function ExportDataComponent({ projectURL }) {
  const entries = useSelector((state) => state.publicAnnotator.annotated);
  const { colorMode, toggleColorMode } = useColorMode();

  const jsonPreview = () => (
    <>
      {/* https://www.w3schools.com/jsref/jsref_slice_array.asp */}
      {entries.slice(0, 2).map((entry) => (
        <>
          {"{"}
          <br />
          <Box marginLeft="5">
            {'    "id": "'}
            {entry}
            {'",'}
            <br />
            {'    "text": "'}
            {entry}
            {'",'}
            <br />
            {'    "value": "'}
            {entry}
            {'",'}
            {'    "value": "value1",'}
            <br />
          </Box>
          {"},"}
        </>
      ))}
      {"{"}
      <br />
      <Box marginLeft="5">
        {'    "id": "1",'}
        <br />
        {'    "text": "text1",'}
        <br />
        {'    "value": "value1",'}
        <br />
      </Box>
      {"}"}
    </>
  );

  const csvPreview = () => (
    <>
      {/* https://www.w3schools.com/jsref/jsref_slice_array.asp */}
      {"id,text,value"}
      <br />
      {entries.slice(0, 3).map((entry) => (
        <>
          {",,"}
          <br />
        </>
      ))}
    </>
  );

  const jsonMockPreview = () => (
    <>
      {"{"}
      <br />
      <Box marginLeft="5">
        {'    "id": "1",'}
        <br />
        {'    "text": "text1",'}
        <br />
        {'    "value": "value1"'}
        <br />
      </Box>
      {"},"}
      <br />
      {"{"}
      <br />
      <Box marginLeft="5">
        {'    "id": "2",'}
        <br />
        {'    "text": "text2",'}
        <br />
        {'    "value": "value2"'}
        <br />
      </Box>
      {"},"}
      <br />
      {"{"}
      <br />
      <Box marginLeft="5">
        {'    "id": "3",'}
        <br />
        {'    "text": "text3",'}
        <br />
        {'    "value": "value3"'}
      </Box>
      {"}"}
    </>
  );

  const csvMockPreview = () => (
    <>
      {"id,text,value"}
      <br />
      {"1,text1,value1"}
      <br />
      {"2,text2,value3"}
      <br />
      {"3,text3,value3"}
      <br />
    </>
  );
  return (
    <Stack direction="row" justify="space-evenly">
      <Card
        variant="outline"
        style={{ cursor: "pointer" }}
        fontSize="2xl"
        w="lg"
      >
        <LinkOverlay
          href={`/api/management/projects/${projectURL}/export?export_type=json`}
        >
          <CardHeader>
            <Text fontSize="2xl" fontWeight="bold">
              Export as JSON
            </Text>
          </CardHeader>
          <CardBody>
            <Center>
              <Code
                backgroundColor={colorMode === "light" ? "white" : "gray.800"}
                fontSize="md"
              >
                {"["}
                <br />
                <Box marginLeft="5">
                  {/* {entries.length >= 3 ? jsonPreview() : jsonMockPreview()} */}
                  {jsonMockPreview()}
                </Box>
                {"]"}
              </Code>
            </Center>
          </CardBody>
        </LinkOverlay>
      </Card>
      <Card
        variant="outline"
        style={{ cursor: "pointer" }}
        fontSize="2xl"
        w="lg"
      >
        <LinkOverlay
          href={`/api/management/projects/${projectURL}/export?export_type=csv`}
        >
          <CardHeader>
            <Text fontSize="2xl" fontWeight="bold">
              Export as CSV
            </Text>
          </CardHeader>
          <CardBody>
            <Center>
              <Code
                backgroundColor={colorMode === "light" ? "white" : "gray.800"}
                fontSize="md"
              >
                <br />
                <Box marginLeft="5">
                  {/* {entries.length >= 3 ? csvPreview() : csvMockPreview()} */}
                  {csvMockPreview()}
                </Box>
              </Code>
            </Center>
          </CardBody>
        </LinkOverlay>
      </Card>
    </Stack>
  );
}
