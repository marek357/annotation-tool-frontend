import React, { useEffect, useState } from "react";

import { Badge, Center, Text } from "@chakra-ui/react";
import {
  Card,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Heading,
  Button,
  SkeletonText,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getCommunityProjects } from "../../../features/public-annotator/thunk";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useNavigate } from "react-router";
import Navbar from "../../components/NavigationBarComponent";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(
    (state) => state.publicAnnotator.communityProjects
  );
  const loaded = useSelector((state) => state.publicAnnotator.loaded);

  useEffect(() => {
    if (!loaded)
      dispatch(getCommunityProjects()).finally(() => setLoading(false));
    else setLoading(false);
  }, [dispatch]);

  const featuredProjectsCarousel = (projects) => {
    return (
      <Stack direction="row" paddingTop="5" paddingBottom="5">
        {projects.map((project) => {
          return (
            // https://chakra-ui.com/docs/components/card
            <Card w="33%">
              <CardBody>
                <Badge colorScheme="green">{project.type}</Badge>
                <br />
                <Stack divider={<StackDivider />} spacing="4">
                  <Text fontSize="lg" as="b" textTransform="capitalize" h="35%">
                    {project.name}
                  </Text>
                  <Box h="50%">
                    <Heading size="xs" textTransform="uppercase">
                      Description
                    </Heading>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {project.description}
                    </ReactMarkdown>
                  </Box>
                  <Box h="15%">
                    <Center>
                      <Button
                        fontSize="sm"
                        colorScheme="teal"
                        variant="ghost"
                        textTransform="uppercase"
                        onClick={() => navigate(`/project/${project.url}`)}
                      >
                        Contribute
                      </Button>
                    </Center>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </Stack>
    );
  };

  return (
    <>
      <Navbar />
      <Center marginTop="5em" w="100%">
        <Stack w="70%">
          <Text fontSize="5xl" fontFamily="Lato" align="center">
            Welcome to Annopedia!
          </Text>
          <Text fontSize="2xl" fontFamily="Lato" align="center">
            Contribute to community projects and find interesting datasets
          </Text>
          <Text
            fontSize="2xl"
            fontFamily="Lato"
            align="center"
            paddingTop="1em"
          >
            <i>Featured projects</i>
          </Text>

          {loading ? (
            // https://chakra-ui.com/docs/components/skeleton/usage
            <>
              <Box padding="5" boxShadow="lg">
                <SkeletonText
                  mt="5"
                  noOfLines={5}
                  spacing="4"
                  skeletonHeight="3"
                />
              </Box>
            </>
          ) : (
            featuredProjectsCarousel(projects.slice(0, 3))
          )}
          <Center>
            <Stack direction="row" spacing="2em">
              <Button
                colorScheme="teal"
                variant="ghost"
                onClick={() => navigate("/community-projects")}
              >
                Browse community projects
              </Button>
              <Button
                colorScheme="teal"
                variant="ghost"
                onClick={() => navigate("/new-project")}
              >
                Begin something great
              </Button>
            </Stack>
          </Center>
          <Text fontSize="md" fontFamily="Lato" align="center">
            Built for people who care, just like you &#10084;&#65039;
          </Text>
        </Stack>
      </Center>
    </>
  );
}
