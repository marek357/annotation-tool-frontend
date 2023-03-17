import {
  Box,
  Button,
  Center,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  SkeletonText,
  SimpleGrid,
  Heading,
  Accordion,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

export default function TextClassificationAnnotationComponent({
  nextText,
  previousText,
  textClassificationData,
  index,
  maxIndex,
  submit,
}) {
  const categories = useSelector((state) => state.publicAnnotator.categories);
  const [category, setCategory] = useState(null);
  const [keyToCategoryMapping, setKeyToCategoryMapping] = useState({});

  const toast = useToast();
  // https://usehooks.com/useKeyPress/
  const handleKeyDown = useCallback(
    async (event) => {
      // https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
      if (event.key in keyToCategoryMapping)
        setCategory(keyToCategoryMapping[event.key]);
      else if (event.key === "Enter") {
        if (category === null) {
          toast({
            title: "Category not selected",
            status: "error",
            duration: 3500,
            isClosable: true,
          });
          return;
        }
        submit({ "category-name": category });
        setCategory(null);
      }
    },
    [keyToCategoryMapping, setCategory, category]
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

  useEffect(() => {
    var localKeyToCategoryMapping = {};
    categories.forEach((category) => {
      localKeyToCategoryMapping[category.key_binding] = category.name;
    });
    if (textClassificationData === null) return;
    console.log("preannotation", textClassificationData.preAnnotation);
    setKeyToCategoryMapping(localKeyToCategoryMapping);
    if (textClassificationData.preAnnotation !== undefined) {
      setCategory(textClassificationData.preAnnotation);
    }
  }, [textClassificationData]);

  const annotationNavigation = () => (
    <>
      <Stack marginBottom="10">
        <SimpleGrid columns="2" spacing="5" marginBottom="2">
          <Button
            variant="outline"
            borderRadius="0"
            colorScheme="blue"
            onClick={previousText}
            isDisabled={index === 1}
          >
            Go back
          </Button>
          <Button
            variant="outline"
            borderRadius="0"
            colorScheme="blue"
            onClick={nextText}
            isDisabled={index === maxIndex}
          >
            Skip for now
          </Button>
        </SimpleGrid>
        <Button
          variant="outline"
          borderRadius="0"
          colorScheme="green"
          onClick={() => {
            if (category === null) {
              toast({
                title: "Category not selected",
                status: "error",
                duration: 3500,
                isClosable: true,
              });
              return;
            }
            submit({ "category-name": category });
            setCategory(null);
          }}
        >
          Submit
        </Button>
      </Stack>
    </>
  );

  const categoriesChoice = () => (
    <>
      <Stack>
        <Text fontSize="3xl" fontFamily="Lato">
          Categories
        </Text>
        <SimpleGrid columns="2" spacing="5">
          {categories.map((localCategory) => (
            <Button
              variant={localCategory.name === category ? null : "outline"}
              colorScheme="teal"
              borderRadius="0"
              onClick={() => setCategory(localCategory.name)}
            >
              {localCategory.name} ({localCategory.key_binding})
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );

  const annotationIndexNavigation = () => (
    <>
      <Text fontSize="3xl">
        Text {index} of {maxIndex}
      </Text>
    </>
  );

  const annotatedText = () => (
    <Box border="1px" padding="3">
      <Text fontSize="3xl">{textClassificationData.text}</Text>
    </Box>
  );

  const annotationContext = () => (
    <>
      <Accordion allowMultiple allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Text fontSize="md" fontFamily="Lato">
              Show more context
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{textClassificationData.context}</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );

  if (textClassificationData === null || index === 0) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  return (
    <>
      <Stack direction="row" padding="10" justify="space-between">
        <div width="50%">
          <Stack justify="center" w="100%">
            {annotationNavigation()}
            {annotationIndexNavigation()}
            {annotatedText()}
            {annotationContext()}
          </Stack>
        </div>
        <div width="50%">{categoriesChoice()}</div>
        {/* <Stack spacing="10" w="70%"></Stack> */}
      </Stack>
    </>
  );
}
