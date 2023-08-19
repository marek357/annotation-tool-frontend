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
  SliderMark,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  ModalBody,
  Heading,
  Center,
} from "@chakra-ui/react";
import randomColor from "randomcolor";
import { useState, useEffect } from "react";
import Highlightable from "highlightable";
import { useSelector } from "react-redux";

// Based on:
// https://www.cambridge.org/core/journals/natural-language-engineering/article/can-machine-translation-systems-be-evaluated-by-the-crowd-alone/E29DA2BC8E6B99AA1481CC92FAB58462

const errors = ["Addition", "Mistranslation", "Untranslated"];
export default function MachineTranslationAdequacyAnnotationComponent({
  nextText,
  previousText,
  translationData,
  index,
  maxIndex,
  submit,
  characterLevelSelection,
}) {
  const [adequacy, setAdequacy] = useState(50);
  const [highlightsSource, setHighlightsSource] = useState([]);
  const [highlightsTarget, setHighlightsTarget] = useState([]);
  const [targetCategories, setTargetCategories] = useState({});
  const [sourceCategories, setSourceCategories] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tempMistranslated, setTempMistranslated] = useState([]);
  const [highlightsMistranslation, setHighlightsMistranslation] = useState([]);
  const [beginningsSource, setBeginningsSource] = useState([]);
  const [endingsSource, setEndingsSource] = useState([]);
  const [beginningsTarget, setBeginningsTarget] = useState([]);
  const [endingsTarget, setEndingsTarget] = useState([]);
  const [choosingCategory, setChoosingCategory] = useState(false);

  const [comment, setComment] = useState("");
  const [targetPopoverOpen, setTargetPopoverOpen] = useState("");

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
    console.log("finding beginning", beginnings, sequenceStart);
    if (beginnings.length === 0) return 0;
    // last word edge case
    if (beginnings[beginnings.length - 1] < sequenceStart)
      return beginnings[beginnings.length - 1];
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
      translationData.referenceTranslation !== undefined &&
      translationData.referenceTranslation !== null
    ) {
      const sentenceStatisticsSource = computeSentenceStatistics(
        translationData.referenceTranslation
      );
      setBeginningsSource(sentenceStatisticsSource[0]);
      setEndingsSource(sentenceStatisticsSource[1]);
    }

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

  const mistranslationComponent = () => {
    return (
      <Box padding="10">
        <Stack direction="column" spacing="10">
          <Highlightable
            ranges={highlightsMistranslation}
            enabled
            style={{ fontFamily: "Lato", fontSize: "1.5em" }}
            rangeRenderer={(
              currentRenderedNodes,
              currentRenderedRange,
              currentRenderedIndex,
              onMouseOverHighlightedWord
            ) => {
              return (
                <Tooltip hasArrow placement="top" label="mistranslation">
                  <Mark
                    bg="orange.400"
                    color="white"
                    borderRightRadius="5px"
                    borderLeftRadius="5px"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setHighlightsMistranslation([]);
                    }}
                  >
                    {currentRenderedNodes}
                  </Mark>
                </Tooltip>
              );
            }}
            onTextHighlighted={(e) => {
              var start;
              var end;

              if (!characterLevelSelection) {
                start = findBeginning(beginningsSource, e.start);
                end = findEnding(endingsSource, e.end);
              } else {
                start = e.start;
                end = e.end;
              }
              console.log(
                "text highlighted",
                start,
                end,
                translationData.referenceTranslation.slice(start, end)
              );
              setHighlightsMistranslation([{ start, end }]);
              // targetCategories[[start, end]] = [
              //   [start, end],
              //   "Mistranslation",
              // ];
              // setTargetCategories(targetCategories);
            }}
            id="mistranslation-text"
            text={translationData.referenceTranslation}
          />
          <Button
            onClick={() => {
              if (highlightsMistranslation.length === 0) {
                toast({
                  title:
                    "Please highlight the mistranslated part of the source text",
                  status: "error",
                  duration: 3500,
                  isClosable: true,
                });
                return;
              }
              //   setTempMistranslated([
              //     currentRenderedRange.start,
              //     currentRenderedRange.end,
              //     event,
              //   ]);
              //   setModalIsOpen(true);
              // } else {
              const colour = randomColor();
              const modifiedCategories = targetCategories;
              modifiedCategories[
                [tempMistranslated[0], tempMistranslated[1]]
              ][1] = tempMistranslated[2];
              modifiedCategories[
                [tempMistranslated[0], tempMistranslated[1]]
              ].push(highlightsMistranslation[0]);
              modifiedCategories[
                [tempMistranslated[0], tempMistranslated[1]]
              ].push(colour);
              console.log("target categories", targetCategories);
              setTargetCategories(modifiedCategories);
              setTempMistranslated([]);
              setModalIsOpen(false);
              setHighlightsSource([
                ...highlightsSource,
                {
                  start: highlightsMistranslation[0].start,
                  end: highlightsMistranslation[0].end,
                },
              ]);
              sourceCategories[
                [
                  highlightsMistranslation[0].start,
                  highlightsMistranslation[0].end,
                ]
              ] = [
                [
                  highlightsMistranslation[0].start,
                  highlightsMistranslation[0].end,
                ],
                "Mistranslation",
                [tempMistranslated[0], tempMistranslated[1]],
                colour,
              ];
              setHighlightsMistranslation([]);
              setSourceCategories(sourceCategories);

              console.log("source ", sourceCategories);
              console.log("source hglights ", highlightsSource);
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    );
  };

  const adequacyComponent = () => {
    return (
      <Box w="100%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Does the the lower text adequately expresses the meaning of the upper
          text?
        </Text>
        <Box border="1px" padding="10">
          <Stack spacing="5">
            <Stack direction="row">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily="Lato"
                whiteSpace="nowrap"
                style={{ lineHeight: "300%" }}
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
              >
                <i>Source text:</i>
              </Text>
              <Highlightable
                ranges={highlightsSource}
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
                    start = findBeginning(beginningsSource, e.start);
                    end = findEnding(endingsSource, e.end);
                  } else {
                    start = e.start;
                    end = e.end;
                  }

                  const modified = highlightsSource.filter(
                    (element) => element.start !== start && element.end !== end
                  );
                  if (modified.length === highlightsSource.length)
                    setHighlightsSource([...highlightsSource, { start, end }]);
                  else setHighlightsSource(modified);
                }}
                rangeRenderer={(
                  currentRenderedNodes,
                  currentRenderedRange,
                  currentRenderedIndex,
                  onMouseOverHighlightedWord
                ) => {
                  console.log(
                    "this is what ive found",
                    Object.keys(targetCategories)
                  );
                  return (
                    <Tooltip
                      hasArrow
                      isOpen={!modalIsOpen}
                      placement="top"
                      label={
                        [
                          currentRenderedRange.start,
                          currentRenderedRange.end,
                        ] in sourceCategories
                          ? sourceCategories[
                              [
                                currentRenderedRange.start,
                                currentRenderedRange.end,
                              ]
                            ][1]
                          : "Omission"
                      }
                    >
                      <Mark
                        bg={
                          [
                            currentRenderedRange.start,
                            currentRenderedRange.end,
                          ] in sourceCategories
                            ? sourceCategories[
                                [
                                  currentRenderedRange.start,
                                  currentRenderedRange.end,
                                ]
                              ][3]
                            : "orange.400"
                        }
                        color="white"
                        borderRightRadius="5px"
                        borderLeftRadius="5px"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          // setSourcePopoverOpen(currentRenderedRange)
                          const e = currentRenderedRange;
                          const modifiedCategories = sourceCategories;
                          console.log(
                            "orubtnig modified entry",
                            modifiedCategories[[e.start, e.end]],
                            e
                          );
                          if ([e.start, e.end] in modifiedCategories) {
                            const eTarget =
                              modifiedCategories[[e.start, e.end]][2];
                            setHighlightsTarget(
                              highlightsTarget.filter(
                                (element) =>
                                  element.start !== eTarget[0] &&
                                  element.end !== eTarget[1]
                              )
                            );
                            // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                            const modifiedCategoriesTarget = targetCategories;
                            console.log(
                              "deleting",
                              eTarget,
                              modifiedCategoriesTarget[eTarget]
                            );
                            delete modifiedCategoriesTarget[eTarget];
                            setTargetCategories(modifiedCategoriesTarget);
                            setTargetPopoverOpen("");
                          }
                          delete modifiedCategories[[e.start, e.end]];
                          setSourceCategories(modifiedCategories);

                          console.log("asdf");
                          console.log(highlightsSource);
                          console.log(sourceCategories);
                          console.log("asdf");
                          console.log(highlightsTarget);
                          console.log(targetCategories);
                          console.log("fdsa");

                          setHighlightsSource(
                            highlightsSource.filter(
                              (element) =>
                                element.start !== e.start &&
                                element.end !== e.end
                            )
                          );
                        }}
                      >
                        {currentRenderedNodes}
                      </Mark>
                    </Tooltip>
                  );
                }}
                id="source-text"
                text={translationData.referenceTranslation}
              />
            </Stack>
            <Stack direction="row">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily="Lato"
                whiteSpace="nowrap"
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
                    delete modifiedCategories[[e.start, e.end]];
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
                          isOpen={
                            !modalIsOpen &&
                            (targetPopoverOpen === "" ||
                              targetPopoverOpen === currentRenderedRange)
                          }
                          // placement="bottom"
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
                            bg={
                              targetCategories[
                                [
                                  currentRenderedRange.start,
                                  currentRenderedRange.end,
                                ]
                              ][1] === "Mistranslation"
                                ? targetCategories[
                                    [
                                      currentRenderedRange.start,
                                      currentRenderedRange.end,
                                    ]
                                  ][3]
                                : "red.400"
                            }
                            color="white"
                            borderRightRadius="5px"
                            borderLeftRadius="5px"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() =>
                              setTargetPopoverOpen(currentRenderedRange)
                            }
                            // https://www.freecodecamp.org/news/javascript-settimeout-js-timer-to-delay-n-seconds/
                            onMouseLeave={() => {
                              // setTimeout(
                              //   (targetPopoverOpenString) => {
                              //     if (
                              //       targetPopoverOpenString ===
                              //         currentRenderedRange &&
                              //       !choosingCategory
                              //     ) {
                              //       console.log(
                              //         targetPopoverOpenString,
                              //         currentRenderedRange
                              //       );
                              //       console.log(
                              //         "choosing category",
                              //         choosingCategory
                              //       );
                              setTargetPopoverOpen("");
                              //     }
                              //   },
                              //   500,
                              //   targetPopoverOpen
                              // )
                            }}
                            onClick={() => {
                              // setSourcePopoverOpen(currentRenderedRange)
                              const e = currentRenderedRange;
                              if (
                                targetCategories[[e.start, e.end]][1] ===
                                "Mistranslation"
                              ) {
                                const eTarget =
                                  targetCategories[[e.start, e.end]][2];
                                setHighlightsSource(
                                  highlightsSource.filter(
                                    (element) =>
                                      element.start !== eTarget.start &&
                                      element.end !== eTarget.end
                                  )
                                );
                                // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                                const modifiedCategoriesSource =
                                  sourceCategories;
                                delete modifiedCategoriesSource[
                                  [eTarget.start, eTarget.end]
                                ];
                                setSourceCategories(modifiedCategoriesSource);
                              } else {
                                console.log(
                                  "not it",
                                  targetCategories[[e.start, e.end]]
                                );
                              }
                              setHighlightsTarget(
                                highlightsTarget.filter(
                                  (element) =>
                                    element.start !== e.start &&
                                    element.end !== e.end
                                )
                              );
                              // https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
                              const modifiedCategories = targetCategories;
                              console.log(
                                "modifiyng categories",
                                e,
                                modifiedCategories[e]
                              );
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
                        onMouseEnter={() => {
                          setChoosingCategory(true);
                          console.log("setchoosingcategory");
                          setTargetPopoverOpen(currentRenderedRange);
                        }}
                        onMouseLeave={() => {
                          setTargetPopoverOpen("");
                          setChoosingCategory(false);
                        }}
                      >
                        <RadioGroup
                          onChange={(event) => {
                            console.log(targetCategories);
                            if (event === "Mistranslation") {
                              setTempMistranslated([
                                currentRenderedRange.start,
                                currentRenderedRange.end,
                                event,
                              ]);
                              setModalIsOpen(true);
                            } else {
                              const modifiedCategories = targetCategories;
                              modifiedCategories[
                                [
                                  currentRenderedRange.start,
                                  currentRenderedRange.end,
                                ]
                              ][1] = event;
                              setTargetCategories(modifiedCategories);
                            }
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
              {/* <Text
                fontSize="2xl"
                fontWeight="bold"
                // textColor="gray.400"
                fontFamily="Lato"
                // https://stackoverflow.com/questions/43184603/select-text-highlight-selection-or-get-selection-value-react
                onMouseUp={() => console.log(window.getSelection().toString())}
              >
                {translationData.MTSystemTranslation}
              </Text> */}
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
            marginTop={10}
            value={adequacy}
            onChange={(event) => setAdequacy(event)}
          >
            <SliderTrack bg="blue.100" h="5">
              <SliderMark value="0">
                <Box bgColor="blue.600" width="4px" height="100%">
                  {/* https://chakra-ui.com/docs/components/slider */}
                  <Tooltip
                    hasArrow
                    placement="bottom"
                    isOpen={!modalIsOpen && targetPopoverOpen === ""}
                    label={`Nonsense/No meaning preserved`}
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
                    isOpen={!modalIsOpen && targetPopoverOpen === ""}
                    label="Some meaning preserved"
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
                    isOpen={!modalIsOpen && targetPopoverOpen === ""}
                    label="Most meaning preserved"
                  >
                    {" | "}
                  </Tooltip>
                </Box>
              </SliderMark>
              <SliderMark value="100">
                <Box bgColor="blue.600" width="4px" height="100%">
                  {/* https://chakra-ui.com/docs/components/slider */}
                  <Tooltip
                    hasArrow
                    placement="bottom"
                    isOpen={!modalIsOpen && targetPopoverOpen === ""}
                    label="Perfect meaning"
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
  };

  return (
    <>
      {/* https://chakra-ui.com/docs/components/modal */}
      <Modal
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
          setHighlightsMistranslation([]);
          // setHighlightsTarget(
          //   highlightsTarget.filter(
          //     (element) =>
          //       element.start !== tempMistranslated[0] &&
          //       element.end !== tempMistranslated[1]
          //   )
          // );
          setTempMistranslated([]);
        }}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Please highlight the mistranslated text in the source
          </ModalHeader>
          <ModalBody>{mistranslationComponent()}</ModalBody>
        </ModalContent>
      </Modal>

      <Stack
        w="100%"
        spacing="10"
        justify="center"
        direction="row"
        paddingBottom={10}
      >
        <Stack direction="column" justify="center" w="75%">
          {/* <Stack> */}
          <div width="100%">{adequacyComponent()}</div>
          <Box padding="10">
            <Textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Please write any comments here about the highlighted errors or annotation"
              w="100%"
            />
          </Box>
          <Text>Selected value {adequacy}</Text>
          {/* </Stack> */}
          <Stack direction="row" justify="center" paddingBottom={10}>
            <div>
              <Button
                onClick={() => {
                  console.log("submitting");
                  console.log(highlightsSource);
                  console.log("source categories", sourceCategories);
                  var source_text_highlights = highlightsSource
                    .filter(
                      (range) => !([range.start, range.end] in sourceCategories)
                    )
                    .map((range) => {
                      const beginning =
                        range.start > range.end ? range.end : range.start;
                      const end =
                        range.start > range.end ? range.start : range.end;

                      return {
                        beginning,
                        end,
                        category: "omission",
                      };
                    });
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
                    var temporary = {
                      beginning,
                      end,
                      category: element[1],
                    };
                    if (element[1] === "Mistranslation") {
                      temporary.mistranslation_source = element[2];
                    }
                    target_text_highlights.push(temporary);
                  });
                  console.log(
                    "presubmit",
                    target_text_highlights,
                    targetCategories
                  );

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
                    return;
                  }

                  // console.log(
                  //   "submitting",
                  //   source_text_highlights,
                  //   target_text_highlights
                  // );
                  // return;
                  submit({
                    adequacy: adequacy,
                    annotator_comment: comment,
                    target_text_highlights,
                    source_text_highlights,
                  });
                  setAdequacy(50);
                  setComment("");
                  setTargetCategories({});
                  setHighlightsSource([]);
                  setHighlightsTarget([]);
                  setHighlightsSource([]);
                  setSourceCategories({});
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
                  <Center>
                    <Text>
                      <b>Source text</b>
                    </Text>
                  </Center>
                  <Text>
                    <b>Omission</b>: The highlighted span in the translation
                    corresponds to information that{" "}
                    <b>
                      <i>does not exist</i>
                    </b>{" "}
                    in the translated text.
                  </Text>
                  <Text>
                    <b>Mistranslation</b>: The highlighted span in the source{" "}
                    <b>
                      <i>does not have the exact same meaning</i>
                    </b>{" "}
                    as the highlighted span in the translation segment.
                  </Text>
                  <Center>
                    <Text>
                      <b>Target text</b>
                    </Text>
                  </Center>
                  <Text>
                    <b>Addition</b>: The highlighted span corresponds to
                    information that{" "}
                    <b>
                      <i>does not exist</i>
                    </b>{" "}
                    in the other segment.
                  </Text>
                  <Text>
                    <b>Mistranslation</b>: The highlighted span in the
                    translation{" "}
                    <b>
                      <i>does not have the exact same meaning</i>
                    </b>{" "}
                    as the highlighted span in the source segment.
                  </Text>
                  <Text>
                    <b>Untranslated</b>: The highlighted span in the translation
                    is a{" "}
                    <b>
                      <i>copy</i>
                    </b>{" "}
                    of the highlighted span in the source segment.
                  </Text>
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
                    <b>Nonsense/No meaning preserved</b>: Nearly all information
                    is lost between the translation and source.
                  </Text>
                  <Text>
                    <b>Some meaning preserved</b>: The translation preserves
                    some of the meaning of the source but misses significant
                    parts.
                  </Text>
                  <Text>
                    <b>Most meaning preserved</b>: The translation retains most
                    of the meaning of the source.
                  </Text>
                  <Text>
                    <b>Perfect meaning</b>: The meaning of the translation is
                    completely consistent with the source.
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
