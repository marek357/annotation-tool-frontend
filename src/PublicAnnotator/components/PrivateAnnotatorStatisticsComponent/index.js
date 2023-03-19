import {
  Divider,
  Heading,
  RadioGroup,
  Stack,
  Radio,
  Text,
  Select,
  Box,
  Button,
  Link,
  LinkOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function PrivateAnnotatorStatisticsComponent({ projectURL }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const privateAnnotators = useSelector(
    (state) => state.publicAnnotator.privateAnnotators
  );
  const [disagreementType, setDisagreementType] = useState(
    "annotator-vs-annotator"
  );
  const [disagreementAnnotator1, setDisagreementAnnotator1] = useState(null);
  const [disagreementAnnotator2, setDisagreementAnnotator2] = useState(null);

  useEffect(() => {
    if (privateAnnotators.length > 0) {
      setDisagreementAnnotator1(privateAnnotators[0].contributor);
      setDisagreementAnnotator2(privateAnnotators[0].contributor);
    }
  }, [privateAnnotators]);

  return (
    <>
      <Text fontSize="2xl">Disagreements</Text>
      <Divider marginBottom="5" />
      {/* <RadioGroup onChange={setDisagreementType} value={disagreementType}> */}
      <Stack direction="column" spacing="10" w="40%">
        {/* <Radio value="all">All disagreements</Radio> */}
        {privateAnnotators.length > 0 ? (
          <Stack direction="row" w="100%">
            {/* <Radio value="annotator-vs-annotator">
                Annotator vs Annotator
              </Radio> */}
            <Stack direction="column" w="100%">
              <Stack direction="row" w="100%">
                <Text w="25%">Annotator 1:</Text>
                <Select
                  onChange={(event) =>
                    setDisagreementAnnotator1(event.target.value)
                  }
                >
                  {privateAnnotators.map((annotator) => (
                    <option>{annotator.contributor}</option>
                  ))}
                </Select>
              </Stack>
              <Stack direction="row">
                <Text w="25%">Annotator 2:</Text>

                <Select
                  onChange={(event) =>
                    setDisagreementAnnotator2(event.target.value)
                  }
                >
                  {privateAnnotators.map((annotator) => (
                    <option>{annotator.contributor}</option>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Text>No private annotators in the project</Text>
        )}
      </Stack>
      {/* </RadioGroup> */}
      {privateAnnotators.length > 0 ? (
        <Box marginTop="10">
          <Link
            href={
              disagreementType === "all"
                ? `/api/management/projects/${projectURL}/export-disagreements`
                : `/api/management/projects/${projectURL}/export-disagreements?annotator1=${disagreementAnnotator1}&annotator2=${disagreementAnnotator2}`
            }
          >
            Export
          </Link>
        </Box>
      ) : null}
    </>
  );
}
