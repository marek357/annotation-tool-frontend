import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
// https://chakra-ui.com/docs/components/accordion
import {
  Box,
  Divider,
  SkeletonText,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
} from "@chakra-ui/react";
import ExploreDataComponent from "../ExploreDataComponent";
import {
  getProjectEntries,
  getUnannotatedData,
  getProjectData,
  getUnannotatedByPublicAnnotatorData,
} from "../../../features/public-annotator/thunk";
import CategoriesDefinitionComponent from "../CategoriesDefinitionComponent";
import ImportUnannotatedData from "../ImportUnannotatedData";
import ManageUploadedUnannotatedDataComponent from "../ManageUploadedUnannotatedDataComponent";
import ExportDataComponent from "../ExportDataComponent";

export default function ProjectHomeComponent({ projectURL }) {
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const projects = useSelector(
    (state) => state.publicAnnotator.communityProjects
  );

  const loadingCard = () => (
    <>
      <Box padding="5" boxShadow="lg">
        <SkeletonText mt="5" noOfLines={5} spacing="4" skeletonHeight="3" />
      </Box>
    </>
  );

  useEffect(() => {
    dispatch(getProjectEntries([projectURL])).then(() =>
      dispatch(getUnannotatedData([projectURL])).then(() =>
        dispatch(getProjectData([projectURL])).then(() =>
          dispatch(getUnannotatedByPublicAnnotatorData([projectURL]))
        )
      )
    );
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const filtered = projects.filter((project) => project.url === projectURL);
    if (filtered.length > 0) {
      setProject(projects.filter((project) => project.url === projectURL)[0]);
      setLoading(false);
    } else {
      const filtered = projects.filter((project) => project.url === projectURL);
      if (filtered.length > 0) {
        setProject(projects.filter((project) => project.url === projectURL)[0]);
      }
    }
  }, [projects]);

  if (loading) {
    return <>{loadingCard()}</>;
  }
  return (
    <>
      <Accordion allowMultiple allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text fontSize="3xl" fontFamily="Lato">
                Description
              </Text>
              <Text fontSize="1xl" fontFamily="Lato">
                Read the dataset description, the intended goals and impact
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
              {project.description}
            </ReactMarkdown>{" "}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text fontSize="3xl" fontFamily="Lato">
                Explore Data
              </Text>
              <Text fontSize="1xl" fontFamily="Lato">
                See the contributions of public and private annotators
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ExploreDataComponent
              projectURL={projectURL}
              projectType={project.type}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text fontSize="3xl" fontFamily="Lato">
                Import Unannotated Data
              </Text>
              <Text fontSize="1xl" fontFamily="Lato">
                Upload data you want contributors to annotate
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ImportUnannotatedData
              projectType={project.type}
              projectURL={projectURL}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text fontSize="3xl" fontFamily="Lato">
                Manage Imported Data
              </Text>
              <Text fontSize="1xl" fontFamily="Lato">
                Manage uploaded unannotated data
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ManageUploadedUnannotatedDataComponent projectURL={projectURL} />
          </AccordionPanel>
        </AccordionItem>
        {project.type === "Text Classification" ||
        project.type === "Named Entity Recognition" ? (
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontSize="3xl" fontFamily="Lato">
                  Categories
                </Text>
                <Text fontSize="1xl" fontFamily="Lato">
                  Define categories for contributors to use
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <CategoriesDefinitionComponent
                showKeyBinding={project.type !== "Named Entity Recognition"}
              />
            </AccordionPanel>
          </AccordionItem>
        ) : null}
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              <Text fontSize="3xl" fontFamily="Lato">
                Export Data
              </Text>
              <Text fontSize="1xl" fontFamily="Lato">
                Download the annotated data in a format most convenient for you
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <ExportDataComponent projectURL={projectURL} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
