import { useEffect, useState } from "react";
import Navbar from "../../../components/NavigationBarComponent";
import NavigationBreadcrumbsComponent from "../../../components/NavigationBreadcrumbsComponent";
import { Text, Stack, Badge, Tag, Button } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getCommunityProjects } from "../../../../features/public-annotator/thunk";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
// https://chakra-ui.com/docs/components/tabs
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ManagePrivateAnnotatorsComponent from "../../../components/ManagePrivateAnnotatorsComponent";
import PrivateAnnotatorStatisticsComponent from "../../../components/PrivateAnnotatorStatisticsComponent";
import ProjectHomeComponent from "../../../components/ProjectHomeComponent";

export default function ProjectHome() {
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
      dispatch(getCommunityProjects()).then(() => {}); // 67a578df-c076-4746-bea8-bc5b884b4a2f
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
            setProject(
              projects.filter((project) => project.url === projectURL)[0]
            );
          } else {
            setError404(true);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
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
          setProject(
            projects.filter((project) => project.url === projectURL)[0]
          );
        } else {
          setError404(true);
        }
      });
    }
  }, [projects]);

  console.log("project", project);

  if (
    error404
    // || Object.keys(project).length === 0
  ) {
    return (
      <>
        <Navbar />
        <NavigationBreadcrumbsComponent
          location={[{ title: projectURL, destination: projectURL }]}
        />
        <Text fontSize="5xl" fontFamily="Lato">
          Project not found :(
        </Text>
      </>
    );
  }

  //   https://stackoverflow.com/questions/6072590/how-to-match-an-empty-dictionary-in-javascript
  if (loading) {
    return (
      <>
        <Navbar />
        <NavigationBreadcrumbsComponent
          location={[{ title: projectURL, destination: projectURL }]}
        />
        Loading
      </>
    );
  }

  const userIsAdmin =
    project.administrators.filter((user) => user === auth.uid).length > 0;

  return (
    <>
      <Navbar />
      <NavigationBreadcrumbsComponent
        location={[{ title: projectURL, destination: projectURL }]}
      />
      <Stack w="100%" padding="10">
        <div>
          <Tag>{project.type}</Tag>
        </div>
        <Text fontSize="5xl" fontFamily="Lato">
          {project.name}
        </Text>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Project</Tab>
            <Tab>Talk</Tab>
            {userIsAdmin ? (
              <>
                <Tab>Manage Private Annotators</Tab>
                <Tab>Private Annotator Statistics</Tab>
              </>
            ) : null}
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProjectHomeComponent projectURL={projectURL} />
              {/* <Stack w="100%" padding="10">
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {project.description}
                </ReactMarkdown>
              </Stack> */}
            </TabPanel>
            <TabPanel>
              {project.talk_markdown.length > 0 ? (
                <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                  {project.talk_markdown}
                </ReactMarkdown>
              ) : (
                <>
                  <Stack spacing="5">
                    <Text fontFamily="Lato">
                      Hey! It seems that the talk for this project doesn't exist
                      yet
                    </Text>
                    <Text fontFamily="Lato">Would you like to create it?</Text>
                    <div>
                      <Button variant="ghost">Create</Button>
                    </div>
                  </Stack>
                </>
              )}
            </TabPanel>
            {userIsAdmin ? (
              <TabPanel>
                <ManagePrivateAnnotatorsComponent projectURL={projectURL} />
              </TabPanel>
            ) : null}
            {userIsAdmin ? (
              <TabPanel>
                <PrivateAnnotatorStatisticsComponent />
              </TabPanel>
            ) : null}
          </TabPanels>
        </Tabs>
        <Text fontSize="md" fontFamily="Lato" align="center">
          Built for people who care, just like you &#10084;&#65039;
        </Text>
      </Stack>
    </>
  );
}
