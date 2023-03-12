import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/NavigationBarComponent";
import { getCommunityProjects } from "../../../features/public-annotator/thunk";
import { Badge, Center, Text } from "@chakra-ui/react";
import {
  Card,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Heading,
  Button,
  Container,
  Tag,
  TagLabel,
  TagLeftIcon,
  SkeletonText,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function BrowseProjects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const communityProjects = useSelector(
    (state) => state.publicAnnotator.communityProjects
  );

  const loaded = useSelector((state) => state.publicAnnotator.loaded);

  useEffect(() => {
    if (!loaded)
      dispatch(getCommunityProjects()).finally(() => setLoading(false));
    else setLoading(false);
  }, [dispatch]);

  const loadingCard = () => (
    // https://chakra-ui.com/docs/components/skeleton/usage
    <>
      <Box padding="5" boxShadow="lg">
        <SkeletonText mt="5" noOfLines={5} spacing="4" skeletonHeight="3" />
      </Box>
    </>
  );

  const projectCard = (project) => {
    return (
      <Card>
        <CardBody>
          {/* <Badge colorScheme="green">{project.type}</Badge> */}
          <Stack divider={<StackDivider />} spacing="4">
            <Stack direction="row" justifyContent="space-between">
              <Text
                fontSize="lg"
                as="b"
                textTransform="capitalize"
                h="35%"
                fontFamily="Lato"
              >
                {project.name}
              </Text>
              <Tag borderRadius="full" variant="solid" colorScheme="green">
                <TagLabel>{project.type}</TagLabel>
              </Tag>
            </Stack>
            <Box h="50%">
              <Heading size="xs" textTransform="uppercase">
                Description
              </Heading>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {project.description}
              </ReactMarkdown>
            </Box>
            <Box h="15%">
              <Button
                fontSize="sm"
                colorScheme="teal"
                variant="ghost"
                textTransform="uppercase"
                onClick={() => navigate(`/project/${project.url}`)}
              >
                Contribute
              </Button>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <Navbar />
      <Center>
        <Stack w="75%" spacing="10">
          {loading
            ? loadingCard()
            : communityProjects.map((project) => projectCard(project))}
          <Text fontSize="md" fontFamily="Lato" align="center">
            Built for people who care, just like you &#10084;&#65039;
          </Text>
        </Stack>
      </Center>
    </>
  );
}
