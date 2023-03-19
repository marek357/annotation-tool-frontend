import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextClassificationAnnotationComponent from "../../../shared/components/TextClassificationAnnotationComponent";
import { useToast, Box, SkeletonText, Text } from "@chakra-ui/react";
import {
  createPrivateAnnotatorAnnotation,
  getPrivateAnnotatorCategories,
} from "../../../features/private-annotator/thunk";
import NamedEntityRecognitionComponent from "../../../shared/components/NamedEntityRecognitionComponent";

export default function NamedEntityRecognitionAnnotation({
  privateAnnotatorToken,
}) {
  const [loading, setLoading] = useState(true);
  const [unannotatedId, setUnannotatedId] = useState(null);
  const [dataToBeAnnotated, setDataToBeAnnotated] = useState(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const unannotated = useSelector(
    (state) => state.privateAnnotator.unannotated
  );

  const categories = useSelector((state) => state.privateAnnotator.categories);

  useEffect(() => {
    dispatch(getPrivateAnnotatorCategories([privateAnnotatorToken])).then(() =>
      setLoading(false)
    );
  }, []);

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

      if (unannotated.length === 0) {
        setDone(true);
        return;
      }
      console.log(index);
      console.log(unannotated);
      console.log(unannotated[index]);
      setUnannotatedId(unannotated[index].id);
      setDataToBeAnnotated({
        NERText: unannotated[index].text,
        categories: categories,
      });
    };
    updateState();
  }, [unannotated, setIndex, index]);

  useEffect(() => {
    if (unannotated.length === 0) return;
    setDataToBeAnnotated({
      NERText: unannotated[index].text,
      categories: categories,
    });
  }, [index]);

  const submitLogic = (data) => {
    dispatch(
      createPrivateAnnotatorAnnotation([
        privateAnnotatorToken,
        unannotatedId,
        data,
      ])
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

  if (done) {
    return (
      <Text fontSize="3xl" textAlign="center">
        There are no more texts to be annotated! Good job!
      </Text>
    );
  }

  return (
    <NamedEntityRecognitionComponent
      index={unannotated.length === 0 ? 0 : index + 1}
      maxIndex={unannotated.length}
      NERData={dataToBeAnnotated}
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
