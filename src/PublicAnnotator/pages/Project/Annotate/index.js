import Navbar from "../../../components/NavigationBarComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import MachineTranslationAdequacyAnnotation from "../../../components/MachineTranslationAdequacyAnnotation";
import NavigationBreadcrumbsComponent from "../../../components/NavigationBreadcrumbsComponent";
import MachineTranslationFluencyAnnotation from "../../../components/MachineTranslationFluencyAnnotation";
import TextClassificationAnnotation from "../../../components/TextClassificationAnnotation";
import NamedEntityRecognitionAnnotation from "../../../components/NamedEntityRecognitionAnnotation";
import { useNavigate, useParams } from "react-router";
import { getCommunityProjects } from "../../../../features/public-annotator/thunk";

export default function Annotate() {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [error404, setError404] = useState(false);

  const navigate = useNavigate();
  const { projectURL } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector(
    (state) => state.publicAnnotator.communityProjects
  );
  const loaded = useSelector((state) => state.publicAnnotator.loaded);
  const auth = useSelector((state) => state.firebase.auth);

  useEffect(() => {
    if (!loaded) {
      dispatch(getCommunityProjects()).then(() => {});
    } else {
      const filtered = projects.filter((project) => project.url === projectURL);
      if (filtered.length > 0) {
        setProject(projects.filter((project) => project.url === projectURL)[0]);
        setLoading(false);
      } else {
        dispatch(getCommunityProjects()).then(() => {
          const filtered = projects.filter(
            (project) => project.url === projectURL
          );
          if (filtered.length > 0) {
            const localProject = projects.filter(
              (project) => project.url === projectURL
            )[0];
            setProject(localProject);
          } else {
            setError404(true);
          }
        });
      }
    }
  }, [auth]);

  useEffect(() => {
    if (projects.length === 0) return;
    const filtered = projects.filter((project) => project.url === projectURL);
    if (filtered.length > 0) {
      // setProject(projects.filter((project) => project.url === projectURL)[0]);
      const localProject = projects.filter(
        (project) => project.url === projectURL
      )[0];
      setProject(localProject);
      setLoading(false);
    } else {
      dispatch(getCommunityProjects()).then(() => {
        const filtered = projects.filter(
          (project) => project.url === projectURL
        );
        if (filtered.length > 0) {
          // setProject(
          //   projects.filter((project) => project.url === projectURL)[0]
          // );
          const localProject = projects.filter(
            (project) => project.url === projectURL
          )[0];
          setProject(localProject);
        } else {
          setError404(true);
        }
      });
    }
  }, [projects]);

  if (
    error404
    // || Object.keys(project).length === 0
  ) {
    return (
      <>
        <Navbar />
        <NavigationBreadcrumbsComponent
          location={[
            { title: projectURL, destination: projectURL },
            {
              title: "Annotate",
              destination: `/project/${projectURL}/public-annotator/annotate`,
            },
          ]}
        />
        <Text fontSize="5xl" fontFamily="Lato">
          Project not found :(
        </Text>
      </>
    );
  }

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
      return <TextClassificationAnnotation projectURL={projectURL} />;
    } else if (projectType === "Machine Translation Adequacy") {
      return <MachineTranslationAdequacyAnnotation projectURL={projectURL} />;
    } else if (projectType === "Machine Translation Fluency") {
      return <MachineTranslationFluencyAnnotation projectURL={projectURL} />;
    } else if (projectType === "Named Entity Recognition") {
      return <NamedEntityRecognitionAnnotation projectURL={projectURL} />;
    }
    return (
      <Center>
        <Card>
          <CardHeader>
            <Heading textAlign="center" fontFamily="Lato">
              Error
            </Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="lg" fontFamily="Lato">
              The requested dataset type is not supported
            </Text>
          </CardBody>
        </Card>
      </Center>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Stack>{loadingCard()}</Stack>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <NavigationBreadcrumbsComponent
        location={[
          { title: projectURL, destination: `/project/${projectURL}` },
          {
            title: "Annotate",
            destination: `/project/${projectURL}/public-annotator/annotate`,
          },
        ]}
      />
      {annotationEditor(project.type)}
      <Text fontSize="md" fontFamily="Lato" align="center">
        Built for people who care, just like you &#10084;&#65039;
      </Text>
    </>
  );
}
