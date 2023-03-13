import Navbar from "../../components/NavigationBarComponent";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  Heading,
  Box,
  SkeletonText,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  getPrivateAnnotatorAnnotated,
  getPrivateAnnotatorDetails,
  getPrivateAnnotatorUnannotated,
} from "../../../features/private-annotator/thunk";
export default function CompletedAnnotations() {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const privateAnnotatorToken = searchParams.get("token");
  const dispatch = useDispatch();
  const annotated = useSelector((state) => state.privateAnnotator.annotated);
  const loaded = useSelector((state) => state.privateAnnotator.loaded);

  const loadingCard = () => (
    // https://chakra-ui.com/docs/components/skeleton/usage
    <>
      <Box padding="5" boxShadow="lg">
        <SkeletonText mt="5" noOfLines={5} spacing="4" skeletonHeight="3" />
      </Box>
    </>
  );

  useEffect(() => {
    if (!loaded) {
      dispatch(getPrivateAnnotatorDetails([privateAnnotatorToken])).then(() =>
        dispatch(getPrivateAnnotatorUnannotated([privateAnnotatorToken])).then(
          () =>
            dispatch(
              getPrivateAnnotatorAnnotated([privateAnnotatorToken])
            ).then(() => setLoading(false))
        )
      );
    } else {
      setLoading(false);
    }
  }, []);

  const annotatedEntryCard = (entryData) => (
    <>
      <Accordion allowMultiple allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {entryData.project_type === "Machine Translation" ? (
                <Text fontSize="3xl" fontFamily="Lato">
                  {entryData.unannotated_source.mt_system_translation}
                </Text>
              ) : null}
              <Text
                fontSize={
                  entryData.project_type === "Machine Translation"
                    ? "1xl"
                    : "3xl"
                }
                fontFamily="Lato"
              >
                {entryData.unannotated_source.text}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {entryData.value_fields.map((valueField) => (
              <Stack direction="row">
                <Text
                  fontSize="1xl"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {valueField}
                  {":"}
                  {entryData[valueField]}
                </Text>
              </Stack>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );

  if (loading) {
    return (
      <>
        <Navbar token={privateAnnotatorToken} />
        <Stack>{loadingCard()}</Stack>
      </>
    );
  }

  if (annotated.length === 0) {
    return (
      <>
        <Navbar token={privateAnnotatorToken} />
        <Text fontSize="3xl" textAlign="center" fontFamily="Lato">
          There are no annotations made (yet)!
        </Text>
      </>
    );
  }

  return (
    <>
      <Navbar token={privateAnnotatorToken} />
      {annotated.map((entry) => annotatedEntryCard(entry))}
    </>
  );
}
