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
} from "@chakra-ui/react";
import { useState } from "react";

export default function TextClassificationAnnotationComponent({
  nextText,
  previousText,
  textClassificationData,
  index,
  maxIndex,
  submit,
}) {
  const [adequacyComplete, setAdequacyComplete] = useState(false);
  const [adequacy, setAdequacy] = useState(2);
  const [fluency, setFluency] = useState(2);

  if (textClassificationData === null) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

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
          {/* <Stack direction="row" justify="space-between">
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
            </Stack> */}

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
                  setFluency(2);
                  setAdequacy(2);
                  setAdequacyComplete(false);
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
