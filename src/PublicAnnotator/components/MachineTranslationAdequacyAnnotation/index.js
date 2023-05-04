import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, Box, SkeletonText, Heading, Text } from "@chakra-ui/react";
import { createPrivateAnnotatorAnnotation } from "../../../features/private-annotator/thunk";
import MachineTranslationAdequacyAnnotationComponent from "../../../shared/components/MachineTranslationAdequacyAnnotationComponent";
import {
  createPublicAnnotatorAnnotation,
  getProjectData,
  getUnannotatedByPublicAnnotatorData,
  getUnannotatedData,
} from "../../../features/public-annotator/thunk";

export default function MachineTranslationAdequacyAnnotation({ projectURL }) {
  const [loading, setLoading] = useState(true);
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);
  const [done, setDone] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.publicAnnotator.unannotatedByPublicAnnotator
  );
  const characterLevelSelection = useSelector(
    (state) => state.publicAnnotator.communityProject.character_level_selection
  );
  const auth = useSelector((state) => state.firebase.auth);

  useEffect(() => {
    dispatch(getProjectData([projectURL])).then(() =>
      dispatch(getUnannotatedData([projectURL])).then(() =>
        dispatch(() =>
          dispatch(getUnannotatedByPublicAnnotatorData([projectURL])).then(() =>
            setLoading(false)
          )
        )
      )
    );
  }, [auth]);

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
      createPublicAnnotatorAnnotation([projectURL, unannotatedId, data])
    ).then(() => {
      toast({
        title: "Submitted! Good job!",
        status: "success",
        duration: 3500,
        isClosable: true,
      });
    });
  };

  if (loading) {
    return <></>;
  }

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
