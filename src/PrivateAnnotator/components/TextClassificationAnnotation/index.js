import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MachineTranslationAnnotationComponent from "../../../shared/components/MachineTranslationAnnotationComponent";
import { useToast, Box, SkeletonText } from "@chakra-ui/react";
import { createPrivateAnnotatorAnnotation } from "../../../features/private-annotator/thunk";

export default function TextClassificationAnnotation({
  privateAnnotatorToken,
}) {
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.privateAnnotator.unannotated
  );

  useEffect(() => {
    if (unannotated.length === 0) return;
    setUnannotatedId(unannotated[0].id);
    setDataToBeAnnotated({
      text: unannotated[0].text,
      context: unannotated[0].context,
    });
  }, [unannotated]);

  const submitLogic = (data) => {
    if (data.classification === undefined) {
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

  return (
    <TextClassificationAnnotationComponent
      translationData={dataToBeAnnotated}
      submit={submitLogic}
    />
  );
}
