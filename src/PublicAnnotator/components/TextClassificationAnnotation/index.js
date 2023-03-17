import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextClassificationAnnotationComponent from "../../../shared/components/TextClassificationAnnotationComponent";
import { useToast, Box, SkeletonText } from "@chakra-ui/react";
import {
  createPublicAnnotatorAnnotation,
  getUnannotatedByPublicAnnotatorData,
} from "../../../features/public-annotator/thunk";
import {
  getProjectData,
  getUnannotatedData,
} from "../../../features/public-annotator/thunk";

export default function TextClassificationAnnotation({ projectURL }) {
  const [loading, setLoading] = useState(true);
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);
  const [index, setIndex] = useState(0);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.publicAnnotator.unannotatedByPublicAnnotator
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
    // https://stackoverflow.com/questions/64191896/usestate-in-useeffect-does-not-update-state
    const updateState = async () => {
      if (index >= unannotated.length) {
        setIndex(unannotated.length - 1);
      }
      if (unannotated.length === 0) {
        setIndex(0);
        setDataToBeAnnotated(null);
      }

      if (unannotated.length === 0) return;
      setUnannotatedId(unannotated[index].id);
      setDataToBeAnnotated({
        text: unannotated[index].text,
        context: unannotated[index].context,
        preAnnotation: unannotated[index].pre_annotation,
      });
    };
    updateState();
  }, [unannotated, setIndex, index]);

  useEffect(() => {
    if (unannotated.length === 0) return;
    setDataToBeAnnotated({
      text: unannotated[index].text,
      context: unannotated[index].context,
      preAnnotation: unannotated[index].pre_annotations["category"],
    });
  }, [index]);

  const submitLogic = (data) => {
    if (data["category-name"] === undefined) {
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
      if (unannotated.length === 0) {
        setIndex(0);
        setDataToBeAnnotated(null);
      }
      console.log("immediately after submit", index);
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

  return (
    <TextClassificationAnnotationComponent
      index={unannotated.length === 0 ? 0 : index + 1}
      maxIndex={unannotated.length}
      textClassificationData={dataToBeAnnotated}
      submit={submitLogic}
      nextText={() => {
        if (index + 1 < unannotated.length) setIndex(index + 1);
      }}
      previousText={() => {
        if (index - 1 >= 0) setIndex(index - 1);
      }}
    />
  );
}
