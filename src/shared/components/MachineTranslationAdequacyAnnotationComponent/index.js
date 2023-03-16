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
  useHighlight,
  Highlight,
  Heading,
  Mark,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { useState } from "react";
// https://www.npmjs.com/package/chakra-ui-steps
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Highlightable from "highlightable";

// Based on:
// https://www.cambridge.org/core/journals/natural-language-engineering/article/can-machine-translation-systems-be-evaluated-by-the-crowd-alone/E29DA2BC8E6B99AA1481CC92FAB58462
export default function MachineTranslationAdequacyAnnotationComponent({
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
  const [highlightsSource, setHighlightsSource] = useState([]);
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState("");

  const sourceHighlight = useHighlight({
    text: translationData === null ? "" : translationData.referenceTranslation,
    query: highlightsSource,
  });

  if (translationData === null) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  const adequacyComponent = () => {
    return (
      <Box w="100%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          The black text adequately expresses the meaning of the gray text
        </Text>
        <Box border="1px" padding="10">
          <Stack spacing="5">
            <Stack direction="row">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily="Lato"
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
              >
                <i>Source text:</i>
              </Text>
              {/* https://chakra-ui.com/docs/components/highlight */}
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily="Lato"
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
                onMouseUp={() => {
                  const selection = window.getSelection().toString();
                  if (selection === "") return;
                  // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
                  const index = highlightsSource.indexOf(selection);
                  if (index < 0) {
                    setHighlightsSource([...highlightsSource, selection]);
                  } else {
                    setHighlightsSource(highlightsSource.splice(index, 1));
                  }
                }}
              >
                {/* <Highlight
                  query={highlightsSource}
                  styles={{ px: "1", py: "1", bg: "orange.100" }}
                >
                  {translationData.referenceTranslation}
                </Highlight> */}
                <Heading lineHeight="tall">
                  {sourceHighlight.map(({ match, text }) => {
                    if (!match) return text;
                    return text === "instantly" ? (
                      <Box>{text}</Box>
                    ) : (
                      <Popover isOpen={sourcePopoverOpen === text}>
                        <PopoverTrigger>
                          <Mark
                            bg="orange"
                            // color="white"
                            // fontFamily="NewYork"
                            px="2"
                            py="1"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setSourcePopoverOpen(text)}
                            onMouseLeave={() => setSourcePopoverOpen("")}
                            onClick={() => {
                              console.log(
                                text,
                                highlightsSource.filter(
                                  (element) => element !== text
                                )
                              );
                              setHighlightsSource(
                                highlightsSource.filter(
                                  (element) => element !== text
                                )
                              );
                            }}
                          >
                            {text}
                          </Mark>
                        </PopoverTrigger>
                        <PopoverContent
                          onMouseEnter={() => setSourcePopoverOpen(text)}
                          onMouseLeave={() => setSourcePopoverOpen("")}
                        >
                          test popover
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </Heading>
              </Text>
            </Stack>
            <Stack direction="row">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily="Lato"
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
              >
                <i>Target text:</i>
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                // textColor="gray.400"
                fontFamily="Lato"
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
                onMouseUp={() => console.log(window.getSelection().toString())}
              >
                {translationData.MTSystemTranslation}
              </Text>
            </Stack>
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
      </Box>
    );
  };

  return (
    <>
      <Stack w="100%" spacing="10" justify="center">
        <Stack direction="row" justify="center" w="100%">
          <div width="100%">{adequacyComponent()}</div>
        </Stack>
        <Stack direction="row" justify="center" paddingBottom={10}>
          <div>
            <Button
              onClick={() => {
                submit({ adequacy: adequacy });
                setAdequacy(2);
              }}
            >
              Submit
            </Button>
          </div>
        </Stack>
      </Stack>
    </>
  );
}
