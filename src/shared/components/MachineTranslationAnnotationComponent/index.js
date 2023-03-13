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
// https://www.npmjs.com/package/chakra-ui-steps
import { Step, Steps, useSteps } from "chakra-ui-steps";

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
  const { nextStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  if (translationData === null) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  const adequacyComponent = () => (
    <>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
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
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
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
      <Steps activeStep={activeStep} padding="10">
        {["Adequacy", "Fluency"].map((label) => (
          <Step label={label} key={label}>
            <Center textAlign="center" padding={10}>
              <Stack spacing="10" w="70%">
                {adequacyComplete ? fluencyComponent() : adequacyComponent()}
                <Stack direction="row" justify="space-around">
                  {adequacyComplete ? (
                    <Button
                      onClick={() => {
                        // setFluency(2);
                        // setAdequacy(2);
                        setAdequacyComplete(false);
                        reset();
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
                        reset();
                      } else {
                        nextStep();
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
          </Step>
        ))}
      </Steps>
      {/* <Stack w="100%" spacing="10" justify="center">
        <Stack direction="row" justify="center">
          <div>{adequacyComponent()}</div>
        </Stack>
        <Stack direction="row" justify="center">
          <div>{fluencyComponent()}</div>
        </Stack>
        <Stack direction="row" justify="center" paddingBottom={10}>
          <div>
            <Button
              onClick={() => {
                submit({ fluency: fluency, adequacy: adequacy });
                setFluency(2);
                setAdequacy(2);
              }}
            >
              Submit
            </Button>
          </div>
        </Stack>
      </Stack> */}
    </>
  );
}
