import Navbar from "../../components/NavigationBarComponent";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrivateAnnotatorDetails,
  getPrivateAnnotatorUnannotated,
  getPrivateAnnotatorAnnotated,
} from "../../../features/private-annotator/thunk";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import MachineTranslationFluencyAnnotation from "../../components/MachineTranslationFluencyAnnotation";
import TextClassificationAnnotation from "../../components/TextClassificationAnnotation";
import MachineTranslationAdequacyAnnotation from "../../components/MachineTranslationAdequacyAnnotation";
import NamedEntityRecognitionAnnotation from "../../components/NamedEntityRecognitionAnnotation";

export default function Annotate() {
  const [loading, setLoading] = useState(true);
  const privateAnnotatorError = useSelector(
    (state) => state.privateAnnotator.privateAnnotatorError
  );
  const privateAnnotator = useSelector(
    (state) => state.privateAnnotator.privateAnnotator
  );
  const loaded = useSelector((state) => state.privateAnnotator.loaded);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const loadingCard = () => (
    // https://chakra-ui.com/docs/components/skeleton/usage
    <>
      <Box padding="5" boxShadow="lg">
        <SkeletonText mt="5" noOfLines={5} spacing="4" skeletonHeight="3" />
      </Box>
    </>
  );

  const annotationEditor = (projectType) => {
    console.log(projectType, "prtype");
    if (projectType === "Text Classification") {
      return <TextClassificationAnnotation privateAnnotatorToken={token} />;
    } else if (projectType === "Machine Translation Adequacy") {
      return (
        <MachineTranslationAdequacyAnnotation privateAnnotatorToken={token} />
      );
    } else if (projectType === "Machine Translation Fluency") {
      return (
        <MachineTranslationFluencyAnnotation privateAnnotatorToken={token} />
      );
    } else if (projectType === "Named Entity Recognition") {
      return <NamedEntityRecognitionAnnotation privateAnnotatorToken={token} />;
    }
  };

  useEffect(() => {
    if (!loaded) {
      dispatch(getPrivateAnnotatorDetails([token])).then(() =>
        dispatch(getPrivateAnnotatorUnannotated([token])).then(() =>
          dispatch(getPrivateAnnotatorAnnotated([token])).then(() =>
            setLoading(false)
          )
        )
      );
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar token={token} />
        <Stack>{loadingCard()}</Stack>
      </>
    );
  }

  if (privateAnnotatorError !== "") {
    return (
      <Center>
        <Card>
          <CardHeader>
            <Heading textAlign="center" fontFamily="Lato">
              Error
            </Heading>
          </CardHeader>
          <CardBody>
            {/* https://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react */}
            <Text
              fontSize="lg"
              fontFamily="Lato"
              style={{ whiteSpace: "pre-line" }}
            >
              {privateAnnotatorError}
            </Text>
            <Text
              fontSize="md"
              fontFamily="Lato"
              align="center"
              marginTop="10"
              textAlign="center"
            >
              Built for people who care, just like you &#10084;&#65039;
            </Text>
          </CardBody>
        </Card>
      </Center>
    );
  }

  return (
    <>
      <Navbar token={token} />
      {annotationEditor(privateAnnotator.project_type)}
      <Text fontSize="md" fontFamily="Lato" align="center">
        Built for people who care, just like you &#10084;&#65039;
      </Text>
    </>
  );
}
