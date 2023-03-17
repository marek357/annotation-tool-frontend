import {
  Box,
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Mark,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  RadioGroup,
  Radio,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import Highlightable from "highlightable";

// Based on:
// https://www.cambridge.org/core/journals/natural-language-engineering/article/can-machine-translation-systems-be-evaluated-by-the-crowd-alone/E29DA2BC8E6B99AA1481CC92FAB58462
export default function MachineTranslationFluencyAnnotationComponent({
  nextText,
  previousText,
  translationData,
  index,
  maxIndex,
  submit,
}) {
  const [fluency, setFluency] = useState(2);
  const [highlightsTarget, setHighlightsTarget] = useState([]);
  const [targetCategories, setTargetCategories] = useState({});
  const [comment, setComment] = useState("");
  const [targetPopoverOpen, setTargetPopoverOpen] = useState(null);
  console.log("translation data", translationData);
  if (translationData === null) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  const fluencyComponent = () => (
    <Box w="100%">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        The text is fluent language
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
              <i>Target text:</i>
            </Text>
            <Highlightable
              ranges={highlightsTarget}
              enabled
              style={{ fontFamily: "Lato", fontSize: "1.5em" }}
              onTextHighlighted={(e) => {
                const modified = highlightsTarget.filter(
                  (element) =>
                    element.start !== e.start && element.end !== e.end
                );
                console.log(e);
                if (modified.length === highlightsTarget.length) {
                  setHighlightsTarget([...highlightsTarget, e]);
                  targetCategories[[e.start, e.end]] = [
                    [e.start, e.end],
                    "Unspecified Error",
                  ];
                  setTargetCategories(targetCategories);
                  // setTargetCategories({
                  //   ...targetCategories,
                  //   e.start.toString(): "Unspecified Error",
                  // });
                } else {
                  setHighlightsTarget(modified);
                  // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                  const modifiedCategories = targetCategories;
                  delete modifiedCategories[e];
                  setTargetCategories(modifiedCategories);
                }
              }}
              rangeRenderer={(
                currentRenderedNodes,
                currentRenderedRange,
                currentRenderedIndex,
                onMouseOverHighlightedWord
              ) => {
                console.log(targetCategories);
                return (
                  <Popover
                    isOpen={targetPopoverOpen === currentRenderedRange}
                    placement="bottom-start"
                  >
                    <PopoverTrigger>
                      <Tooltip
                        hasArrow
                        isOpen
                        placement="bottom"
                        label={
                          targetCategories[
                            [
                              currentRenderedRange.start,
                              currentRenderedRange.end,
                            ]
                          ][1]
                        }
                      >
                        <Mark
                          bg="red.400"
                          color="white"
                          borderRightRadius="5px"
                          borderLeftRadius="5px"
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() =>
                            setTargetPopoverOpen(currentRenderedRange)
                          }
                          onMouseLeave={() => setTargetPopoverOpen("")}
                          onClick={() => {
                            const e = currentRenderedRange;
                            setHighlightsTarget(
                              highlightsTarget.filter(
                                (element) =>
                                  element.start !== e.start &&
                                  element.end !== e.end
                              )
                            );
                            // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                            const modifiedCategories = targetCategories;
                            delete modifiedCategories[e];
                            setTargetCategories(modifiedCategories);
                          }}
                        >
                          {currentRenderedNodes}
                        </Mark>
                      </Tooltip>
                    </PopoverTrigger>
                    <PopoverContent
                      onMouseEnter={() =>
                        setTargetPopoverOpen(currentRenderedRange)
                      }
                      onMouseLeave={() => setTargetPopoverOpen("")}
                    >
                      <RadioGroup
                        onChange={(event) => {
                          const modifiedCategories = targetCategories;
                          modifiedCategories[
                            [
                              currentRenderedRange.start,
                              currentRenderedRange.end,
                            ]
                          ][1] = event;
                          setTargetCategories(modifiedCategories);
                        }}
                      >
                        <Stack direction="column">
                          <Radio value="Error 1">Error 1</Radio>
                          <Radio value="Error 2">Error 2</Radio>
                          <Radio value="Error 3">Error 3</Radio>
                        </Stack>
                      </RadioGroup>
                    </PopoverContent>
                  </Popover>
                );
              }}
              id="source-text"
              text={translationData.MTSystemTranslation}
            />
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
    </Box>
  );

  return (
    <>
      <Stack w="100%" spacing="10" justify="center" direction="row">
        <Stack direction="column" justify="center" w="75%">
          <div width="100%">{fluencyComponent()}</div>
          <Box padding="10">
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Please write any comments here about the highlighted errors or annotation"
              w="100%"
            />
          </Box>
          <Stack direction="row" justify="center" paddingBottom={10}>
            <div>
              <Button
                onClick={() => {
                  var target_text_highlights = [];
                  // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
                  Object.keys(targetCategories).forEach((key, index) => {
                    const element = targetCategories[key];
                    const beginning =
                      element[0][0] > element[0][1]
                        ? element[0][1]
                        : element[0][0];
                    const end =
                      element[0][0] > element[0][1]
                        ? element[0][0]
                        : element[0][1];
                    // https://www.w3schools.com/jsref/jsref_push.asp
                    target_text_highlights.push({
                      beginning,
                      end,
                      category: element[1],
                    });
                  });
                  submit({
                    fluency: fluency,
                    annotator_comment: comment,
                    target_text_highlights,
                  });
                  setFluency(2);
                  setComment("");
                  setTargetCategories({});
                  setHighlightsTarget([]);
                }}
              >
                Submit
              </Button>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
