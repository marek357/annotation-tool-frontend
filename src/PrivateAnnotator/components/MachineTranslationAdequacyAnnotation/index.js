import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, Box, SkeletonText, Heading, Text } from "@chakra-ui/react";
import { createPrivateAnnotatorAnnotation } from "../../../features/private-annotator/thunk";
import MachineTranslationAdequacyAnnotationComponent from "../../../shared/components/MachineTranslationAdequacyAnnotationComponent";

export default function MachineTranslationAdequacyAnnotation({
  privateAnnotatorToken,
}) {
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);
  const [done, setDone] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.privateAnnotator.unannotated
  );
  const characterLevelSelection = useSelector(
    (state) =>
      state.privateAnnotator.privateAnnotator.character_level_annotation
  );

  useEffect(() => {
    if (unannotated.length === 0) {
      setDone(true);
      return;
    }
    setUnannotatedId(unannotated[0].id);
    setDataToBeAnnotated({
      referenceTranslation: unannotated[0].text,
      MTSystemTranslation: unannotated[0].mt_system_translation,
    });
  }, [unannotated]);

  const submitLogic = (data) => {
    if (data.adequacy === undefined) {
      toast({
        title: "Submission error",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
      return;
    }
    dispatch(
      createPrivateAnnotatorAnnotation([
        privateAnnotatorToken,
        unannotatedId,
        data,
      ])
    ).then(() => {
      toast({
        title: "Submitted! Good job!",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
    });
  };

  if (done) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  return (
    <>
      <MachineTranslationAdequacyAnnotationComponent
        translationData={dataToBeAnnotated}
        submit={submitLogic}
        characterLevelSelection={
          characterLevelSelection !== undefined &&
          characterLevelSelection !== null &&
          characterLevelSelection === true
        }
      />
      <Text
        textTransform="uppercase"
        fontSize="1xs"
        paddingBottom="10"
        paddingLeft="5"
        // fontWeight="bold"
        textAlign="center"
      >
        Texts left to be annotated: {unannotated.length}
      </Text>
    </>
  );
}
