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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import Highlightable from "highlightable";
import { useSelector } from "react-redux";

export default function NamedEntityRecognitionComponent({
  nextText,
  previousText,
  NERData,
  index,
  maxIndex,
  submit,
}) {
  const [highlightsNER, setHighlightsNER] = useState([]);
  const [highlightCategories, setHighlightCategories] = useState({});
  const [NERPopoverOpen, setNERPopoverOpen] = useState(null);
  const toast = useToast();

  // const categories = useSelector((state) => state.publicAnnotator.categories);

  if (NERData === null) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  const NERComponent = () => {
    return (
      <Box w="100%">
        <Box border="1px" padding="10">
          <Stack direction="row">
            <Highlightable
              ranges={highlightsNER}
              enabled
              style={{ fontFamily: "Lato", fontSize: "1.5em" }}
              onTextHighlighted={(e) => {
                const modified = highlightsNER.filter(
                  (element) =>
                    element.start !== e.start && element.end !== e.end
                );
                console.log(e);
                if (modified.length === highlightsNER.length) {
                  setHighlightsNER([...highlightsNER, e]);
                  highlightCategories[[e.start, e.end]] = [
                    [e.start, e.end],
                    "Unspecified Tag",
                  ];
                  setHighlightCategories(highlightCategories);
                } else {
                  setHighlightsNER(modified);
                  // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                  const modifiedCategories = highlightCategories;
                  delete modifiedCategories[e];
                  setHighlightCategories(modifiedCategories);
                }
              }}
              rangeRenderer={(
                currentRenderedNodes,
                currentRenderedRange,
                currentRenderedIndex,
                onMouseOverHighlightedWord
              ) => {
                console.log(highlightCategories);
                return (
                  <Popover
                    isOpen={NERPopoverOpen === currentRenderedRange}
                    placement="bottom-start"
                  >
                    <PopoverTrigger>
                      <Tooltip
                        hasArrow
                        isOpen
                        placement="bottom"
                        label={
                          highlightCategories[
                            [
                              currentRenderedRange.start,
                              currentRenderedRange.end,
                            ]
                          ][1]
                        }
                        onMouseEnter={() =>
                          setNERPopoverOpen(currentRenderedRange)
                        }
                        onMouseLeave={() => setNERPopoverOpen("")}
                      >
                        <Mark
                          bg="red.400"
                          color="white"
                          borderRightRadius="5px"
                          borderLeftRadius="5px"
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() =>
                            setNERPopoverOpen(currentRenderedRange)
                          }
                          onMouseLeave={() => setNERPopoverOpen("")}
                          onClick={() => {
                            // setSourcePopoverOpen(currentRenderedRange)
                            const e = currentRenderedRange;
                            setHighlightsNER(
                              highlightsNER.filter(
                                (element) =>
                                  element.start !== e.start &&
                                  element.end !== e.end
                              )
                            );
                            // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                            const modifiedCategories = highlightCategories;
                            delete modifiedCategories[e];
                            setHighlightCategories(modifiedCategories);
                          }}
                        >
                          {currentRenderedNodes}
                        </Mark>
                      </Tooltip>
                    </PopoverTrigger>
                    <PopoverContent
                      onMouseEnter={() =>
                        setNERPopoverOpen(currentRenderedRange)
                      }
                      onMouseLeave={() => setNERPopoverOpen("")}
                    >
                      <RadioGroup
                        onChange={(event) => {
                          var modifiedCategories = highlightCategories;
                          modifiedCategories[
                            [
                              currentRenderedRange.start,
                              currentRenderedRange.end,
                            ]
                          ][1] = event;
                          setHighlightCategories(modifiedCategories);
                        }}
                      >
                        <Stack direction="column">
                          {NERData.categories !== undefined
                            ? NERData.categories.map((category) => (
                                <Radio value={category.name}>
                                  {category.name}
                                </Radio>
                              ))
                            : null}
                        </Stack>
                      </RadioGroup>
                    </PopoverContent>
                  </Popover>
                );
              }}
              id="ner-text"
              text={NERData.NERText}
            />
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Stack w="100%" spacing="10" justify="center" direction="row">
        <Stack direction="column" justify="center" w="75%">
          <div width="100%">{NERComponent()}</div>
          <Stack direction="row" justify="center" paddingBottom={10}>
            <div>
              <Button
                onClick={() => {
                  var ner_text_highlights = [];
                  // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
                  Object.keys(highlightCategories).forEach((key, index) => {
                    const element = highlightCategories[key];
                    const beginning =
                      element[0][0] > element[0][1]
                        ? element[0][1]
                        : element[0][0];
                    const end =
                      element[0][0] > element[0][1]
                        ? element[0][0]
                        : element[0][1];
                    // https://www.w3schools.com/jsref/jsref_push.asp
                    ner_text_highlights.push({
                      beginning,
                      end,
                      category: element[1],
                    });
                  });
                  if (
                    ner_text_highlights.filter(
                      (elem) => elem.category === "Unspecified Tag"
                    ).length > 0
                  ) {
                    toast({
                      title: "Please specify all unspecified tags",
                      status: "error",
                      duration: 3500,
                      isClosable: true,
                    });
                    return;
                  }
                  submit({
                    ner_text_highlights,
                  });
                  setHighlightCategories({});
                  setHighlightsNER([]);
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
