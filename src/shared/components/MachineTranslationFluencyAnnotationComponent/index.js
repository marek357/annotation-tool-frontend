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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Radio,
  Textarea,
  useToast,
  SliderMark,
  Modal,
  ModalContent,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Highlightable from "highlightable";

// Based on:
// https://www.cambridge.org/core/journals/natural-language-engineering/article/can-machine-translation-systems-be-evaluated-by-the-crowd-alone/E29DA2BC8E6B99AA1481CC92FAB58462
const errors = ["Grammar", "Spelling", "Typography", "Unintelligeble"];
export default function MachineTranslationFluencyAnnotationComponent({
  nextText,
  previousText,
  translationData,
  index,
  maxIndex,
  submit,
  characterLevelSelection,
}) {
  const [fluency, setFluency] = useState(50);
  const [highlightsTarget, setHighlightsTarget] = useState([]);
  const [targetCategories, setTargetCategories] = useState({});
  const [comment, setComment] = useState("");
  const [targetPopoverOpen, setTargetPopoverOpen] = useState("");
  const [beginningsTarget, setBeginningsTarget] = useState([]);
  const [endingsTarget, setEndingsTarget] = useState([]);

  const toast = useToast();

  const computeSentenceStatistics = (sentence) => {
    var beginnings = [];
    var endings = [];
    var beginning = 0;

    for (var i = 0; i < sentence.length; i++) {
      const character = sentence.charAt(i);
      if (character === " ") {
        beginnings.push(beginning);
        endings.push(i - 1);
        beginning = i + 1;
      }
    }

    // edge case for last word in sentence
    // if the sentence doesn't end with a
    // space character
    if (beginning < sentence.length) {
      beginnings.push(beginning);
      endings.push(sentence.length - 1);
    }

    return [beginnings, endings];
  };

  const findBeginning = (beginnings, sequenceStart) => {
    if (beginnings.length === 0) return 0;
    for (var i = beginnings.length - 1; i > 0; i--) {
      if (sequenceStart === beginnings[i]) return beginnings[i];
      if (sequenceStart < beginnings[i] && sequenceStart > beginnings[i - 1])
        return beginnings[i - 1];
    }
    return 0;
  };

  const findEnding = (endings, sequenceEnd) => {
    if (endings.length === 0) return 0;
    for (var i = 0; i < endings.length - 1; i++) {
      if (sequenceEnd === endings[i]) return endings[i];
      if (sequenceEnd > endings[i] && sequenceEnd < endings[i + 1])
        return endings[i + 1];
    }
    return endings[endings.length - 1];
  };

  useEffect(() => {
    if (
      translationData !== undefined &&
      translationData !== null &&
      translationData.MTSystemTranslation !== undefined &&
      translationData.MTSystemTranslation !== null
    ) {
      const sentenceStatisticsTarget = computeSentenceStatistics(
        translationData.MTSystemTranslation
      );
      setBeginningsTarget(sentenceStatisticsTarget[0]);
      setEndingsTarget(sentenceStatisticsTarget[1]);
    }
  }, [translationData]);

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
        Is this text fluent?
      </Text>
      <Box border="1px" padding="10">
        <Stack spacing="5">
          <Stack direction="row">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              fontFamily="Lato"
              style={{ lineHeight: "300%" }}
              // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
            >
              <i>Target text:</i>
            </Text>
            <Highlightable
              ranges={highlightsTarget}
              enabled
              style={{
                fontFamily: "Lato",
                fontSize: "1.5em",
                lineHeight: "300%",
              }}
              onTextHighlighted={(e) => {
                var start;
                var end;

                if (!characterLevelSelection) {
                  start = findBeginning(beginningsTarget, e.start);
                  end = findEnding(endingsTarget, e.end);
                } else {
                  start = e.start;
                  end = e.end;
                }

                const modified = highlightsTarget.filter(
                  (element) => element.start !== start && element.end !== end
                );
                console.log(e);
                if (modified.length === highlightsTarget.length) {
                  setHighlightsTarget([...highlightsTarget, { start, end }]);
                  targetCategories[[start, end]] = [
                    [start, end],
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
                        style={{ opacity: 0.3 }}
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
                            console.log(
                              "beginning to delete",
                              targetCategories,
                              "with",
                              e,
                              targetCategories[[e.start, e.end]]
                            );
                            const modifiedCategories = targetCategories;
                            delete modifiedCategories[[e.start, e.end]];
                            setTargetCategories(modifiedCategories);
                            setTargetPopoverOpen("");
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
                          {errors.map((error) => (
                            <Radio value={error}>{error}</Radio>
                          ))}
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
          max={100}
          defaultValue={50}
          step={1}
          // marginTop={10}
          value={fluency}
          onChange={(event) => setFluency(event)}
        >
          <SliderTrack bg="blue.100" h="5">
            <SliderMark value="0">
              <Box bgColor="blue.600" width="4px" height="100%">
                {/* https://chakra-ui.com/docs/components/slider */}
                <Tooltip
                  hasArrow
                  placement="bottom"
                  isOpen={targetPopoverOpen === ""}
                  label="Incomprehensible"
                >
                  {" | "}
                </Tooltip>
              </Box>
            </SliderMark>
            <SliderMark value="33">
              <Box bgColor="blue.600" width="4px" height="100%">
                {/* https://chakra-ui.com/docs/components/slider */}
                <Tooltip
                  hasArrow
                  placement="bottom"
                  isOpen={targetPopoverOpen === ""}
                  label="Poor grammar and disfluent"
                >
                  {" | "}
                </Tooltip>
              </Box>
            </SliderMark>
            <SliderMark value="66">
              <Box bgColor="blue.600" width="4px" height="100%">
                {/* https://chakra-ui.com/docs/components/slider */}
                <Tooltip
                  hasArrow
                  placement="bottom"
                  isOpen={targetPopoverOpen === ""}
                  label="Grammatically correct, potentially unnatural"
                >
                  {" | "}
                </Tooltip>
              </Box>
            </SliderMark>
            <SliderMark value="100">
              <Box bgColor="blue.600" width="200px" height="100%">
                {/* https://chakra-ui.com/docs/components/slider */}
                <Tooltip
                  hasArrow
                  placement="bottom"
                  isOpen={targetPopoverOpen === ""}
                  label="Fluent and natural"
                >
                  {" | "}
                </Tooltip>
              </Box>
            </SliderMark>
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
        <Stack direction="column" justify="center" w="75%" paddingBottom={10}>
          <div width="100%">{fluencyComponent()}</div>
          <Box padding="10">
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Please write any comments here about the highlighted errors or annotation"
              w="100%"
            />
          </Box>
          <Text>Selected value {fluency}</Text>

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
                  if (
                    target_text_highlights.filter(
                      (elem) => elem.category === "Unspecified Error"
                    ).length > 0
                  ) {
                    toast({
                      title: "Please specify all unspecified errors",
                      status: "error",
                      duration: 3500,
                      isClosable: true,
                    });
                    console.log("target:", target_text_highlights);
                    return;
                  }

                  submit({
                    fluency: fluency,
                    annotator_comment: comment,
                    target_text_highlights,
                  });
                  setFluency(50);
                  setComment("");
                  setTargetCategories({});
                  setHighlightsTarget([]);
                }}
              >
                Submit
              </Button>
            </div>
          </Stack>
          <Accordion allowMultiple allowToggle marginBottom={100}>
            <AccordionItem>
              <AccordionButton>
                <Text fontSize="md" fontFamily="Lato">
                  MQM Guidelines (rules how to highlight the source and target
                  text)
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {" "}
                <Stack
                  textAlign="left"
                  justifyContent="left"
                  direction="column"
                  w="100%"
                >
                  <Text>
                    <b>Grammar</b>: The highlighted span corresponds to issues
                    related to the grammar or syntax of the text, other than
                    spelling and orthography.
                  </Text>
                  <Text>
                    <b>Spelling</b>: The highlighted span corresponds to issues
                    related to spelling of words.
                  </Text>
                  <Text>
                    <b>Typography</b>: The highlighted span corresponds to
                    issues related to punctuation and diacritics.
                  </Text>
                  <Text>
                    <b>Unintelligible</b>: The exact nature of the error cannot
                    be determined. Indicates a major break down in fluency.
                  </Text>
                  {/* <Text>
                    <b>Orthography</b>: The highlighted span corresponds to
                    issues related to spelling of words.
                  </Text> */}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Accordion allowMultiple allowToggle marginBottom={100}>
            <AccordionItem>
              <AccordionButton>
                <Text fontSize="md" fontFamily="Lato">
                  DA Guidelines (rules how to choose the right % value)
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {" "}
                <Stack
                  textAlign="left"
                  justifyContent="left"
                  direction="column"
                  w="100%"
                >
                  <Text>
                    <b>Incomprehensible</b>: The translation is completely
                    unintelligible and nonsensical. The text is difficult to
                    understand.
                  </Text>
                  <Text>
                    <b>Poor grammar and disfluent</b>: The translation contains
                    significant errors in grammar, syntax, and vocabulary that
                    affects the clarity and naturalness of the text.
                  </Text>
                  <Text>
                    <b>Grammatically correct, potentially unnatural</b>: The
                    translation is grammatically correct but may have some
                    errors in spellings, word choice, or syntax. The language
                    may not be natural.
                  </Text>
                  <Text>
                    <b>Fluent and natural</b>: The translation contains no
                    grammatical errors, the vocabulary is precise, and the text
                    is easy to read and understand.
                  </Text>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Stack>
    </>
  );
}
