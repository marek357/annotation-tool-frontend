import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MachineTranslationAnnotationComponent from "../../../shared/components/MachineTranslationAnnotationComponent";
import { useToast } from "@chakra-ui/react";
import { createPrivateAnnotatorAnnotation } from "../../../features/private-annotator/thunk";

export default function MachineTranslationAnnotation({
  privateAnnotatorToken,
}) {
  const [index, setIndex] = useState(0);
  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.privateAnnotator.unannotated
  );

  const nextText = () => {
    if (index + 1 < unannotated.length) setIndex(index + 1);
  };

  const previousText = () => {
    if (index > 0) setIndex(index - 1);
  };

  const getText = () => {
    // sanity check
    if (index < unannotated.length)
      return {
        referenceTranslation: unannotated[index].text,
        MTSystemTranslation: unannotated[index].mt_system_translation,
      };
  };

  const submitLogic = (data) => {
    if (data.fluency === undefined || data.adequacy === undefined) {
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
        unannotated[index].id,
        data,
      ])
    );
  };

  return (
    <MachineTranslationAnnotationComponent
      nextText={nextText}
      previousText={previousText}
      translationData={getText()}
      index={index}
      maxIndex={unannotated.length}
      submit={submitLogic}
    />
  );
}
