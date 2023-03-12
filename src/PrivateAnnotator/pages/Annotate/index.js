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
import MachineTranslationAnnotationComponent from "../../../shared/components/MachineTranslationAnnotationComponent";
import MachineTranslationAnnotation from "../../components/MachineTranslationAnnotation";

export default function Annotate() {
  const [loading, setLoading] = useState(true);
  const privateAnnotatorError = useSelector(
    (state) => state.privateAnnotator.privateAnnotatorError
  );
  const privateAnnotator = useSelector(
    (state) => state.privateAnnotator.privateAnnotator
  );
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
    if (projectType === "Text Classification") {
      return <>Text Classification</>;
    } else if (projectType === "Machine Translation") {
      return <MachineTranslationAnnotation privateAnnotatorToken={token} />;
    }
  };

  useEffect(() => {
    dispatch(getPrivateAnnotatorDetails([token])).then(() =>
      dispatch(getPrivateAnnotatorUnannotated([token])).then(() =>
        dispatch(getPrivateAnnotatorAnnotated([token])).then(() =>
          setLoading(false)
        )
      )
    );
  }, []);

  if (loading) {
    return <Stack>{loadingCard()}</Stack>;
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
            <Text fontSize="md" fontFamily="Lato" align="center" marginTop="10">
              Built for people who care, just like you &#10084;&#65039;
            </Text>
          </CardBody>
        </Card>
      </Center>
    );
  }

  return (
    <>
      <Navbar privateAnnotator token={token} />
      {annotationEditor(privateAnnotator.project_type)}
      <Text fontSize="md" fontFamily="Lato" align="center">
        Built for people who care, just like you &#10084;&#65039;
      </Text>
    </>
  );
}
