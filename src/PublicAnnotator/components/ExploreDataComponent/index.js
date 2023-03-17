import { CloseIcon } from "@chakra-ui/icons";
import { Button, IconButton, Tooltip } from "@chakra-ui/react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectEntry,
  getProjectEntries,
} from "../../../features/public-annotator/thunk";

export default function ExploreDataComponent({ projectURL, type }) {
  const dispatch = useDispatch();
  var data = useSelector((state) => state.publicAnnotator.annotated).map(
    (element) => ({ ...element, value: JSON.stringify(element.value) })
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Text",
      selector: (row) => row.text,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: false,
    },
    {
      name: "Contributor",
      selector: (row) => row.annotator,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <Tooltip label="Delete Entry" aria-label="Delete Entry">
          <IconButton
            aria-label="Delete Entry"
            icon={<CloseIcon />}
            onClick={() => {
              dispatch(deleteProjectEntry([projectURL, row.id])).then(() =>
                dispatch(getProjectEntries([projectURL]))
              );
              console.log(row);
            }}
          />
        </Tooltip>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    if (data === undefined || data.length === 0) {
      console.log("project entries", projectURL);
      dispatch(getProjectEntries([projectURL]));
    }
  }, [projectURL]);
  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
