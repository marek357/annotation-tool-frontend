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
} from "@chakra-ui/react";
import { useState } from "react";

// Based on:
// https://www.cambridge.org/core/journals/natural-language-engineering/article/can-machine-translation-systems-be-evaluated-by-the-crowd-alone/E29DA2BC8E6B99AA1481CC92FAB58462
export default function MachineTranslationAnnotationComponent({
  nextText,
  previousText,
  translationData,
  index,
  maxIndex,
  submit,
}) {
  const [adequacyComplete, setAdequacyComplete] = useState(false);
  const [adequacy, setAdequacy] = useState(2);
  const [fluency, setFluency] = useState(2);

  if (translationData === undefined) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  const adequacyComponent = () => (
    <>
      <Text fontSize="2xl" fontWeight="bold">
        The black text adequately expresses the meaning of the gray text
      </Text>
      <Box border="1px" padding="10">
        <Stack spacing="5">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textColor="gray.400"
            fontFamily="Lato"
          >
            {translationData.referenceTranslation}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" fontFamily="Lato">
            {translationData.MTSystemTranslation}
          </Text>
        </Stack>
      </Box>
      {/* https://chakra-ui.com/docs/components/slider */}
      <Stack direction="row">
        <Text fontFamily="Lato">strongly disagree</Text>
        <Slider
          min={0}
          max={4}
          defaultValue={2}
          step={1}
          marginTop={10}
          value={adequacy}
          onChange={(event) => setAdequacy(event)}
        >
          <SliderTrack bg="blue.100" h="5" borderRadius={20}>
            <SliderFilledTrack bg="blue.100" />
          </SliderTrack>
          <SliderThumb boxSize={8} bg="blue.300" />
        </Slider>
        <Text fontFamily="Lato">strongly agree</Text>
      </Stack>
    </>
  );

  const fluencyComponent = () => (
    <>
      <Text fontSize="2xl" fontWeight="bold">
        The text is fluent English
      </Text>
      <Box border="1px" padding="10">
        <Stack spacing="5">
          <Text fontSize="2xl" fontWeight="bold" fontFamily="Lato">
            {translationData.MTSystemTranslation}
          </Text>
        </Stack>
      </Box>
      {/* https://chakra-ui.com/docs/components/slider */}
      <Stack direction="row">
        <Text fontFamily="Lato">strongly disagree</Text>
        <Slider
          min={0}
          max={4}
          defaultValue={2}
          step={1}
          marginTop={10}
          value={fluency}
          onChange={(event) => setFluency(event)}
        >
          <SliderTrack bg="blue.100" h="5" borderRadius={20}>
            <SliderFilledTrack bg="blue.100" />
          </SliderTrack>
          <SliderThumb boxSize={8} bg="blue.300" />
        </Slider>
        <Text fontFamily="Lato">strongly agree</Text>
      </Stack>
    </>
  );

  return (
    <>
      <Center textAlign="center" padding={10}>
        <Stack spacing="10" w="70%">
          <Stack direction="row" justify="space-between">
            <Button
              isDisabled={index === 0}
              variant="outline"
              colorScheme="blue"
              onClick={previousText}
            >
              Go to previous text
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={nextText}
              isDisabled={index === maxIndex - 1}
            >
              Skip for now
            </Button>
          </Stack>

          {adequacyComplete ? fluencyComponent() : adequacyComponent()}
          <Stack direction="row" justify="space-around">
            {adequacyComplete ? (
              <Button
                onClick={() => {
                  setFluency(2);
                  setAdequacy(2);
                  setAdequacyComplete(false);
                }}
                w="100%"
              >
                Back
              </Button>
            ) : null}
            <Button
              onClick={() => {
                if (adequacyComplete) {
                  submit({ fluency: fluency, adequacy: adequacy });
                } else {
                  setAdequacyComplete(true);
                }
              }}
              w="100%"
              textAlign="center"
            >
              {adequacyComplete ? "Submit" : "Next"}
            </Button>
          </Stack>
        </Stack>
      </Center>
    </>
  );
}
