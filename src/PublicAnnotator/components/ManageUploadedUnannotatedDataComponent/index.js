import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUnannotatedProjectEntry,
  getProjectEntries,
  getUnannotatedData,
} from "../../../features/public-annotator/thunk";

export default function ManageUploadedUnannotatedDataComponent({ projectURL }) {
  const dispatch = useDispatch();
  const type = useSelector(
    (state) => state.publicAnnotator.communityProject.type
  );
  const data = useSelector((state) => state.publicAnnotator.unannotated);

  const columns = (type) => [
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
      name: "Context",
      selector: (row) => row.context,
      sortable: false,
    },
    {
      name: "Preannotations",
      selector: (row) =>
        type === "Text Classification"
          ? row.pre_annotations["category"]
          : JSON.stringify(row.pre_annotations),
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
              dispatch(
                deleteUnannotatedProjectEntry([projectURL, row.id])
              ).then(() => dispatch(getUnannotatedData([projectURL])));
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
      console.log(projectURL, "<-projecturl");
      dispatch(getUnannotatedData([projectURL]));
    }
  }, [projectURL]);
  return (
    <>
      <DataTable columns={columns(type)} data={data} />
    </>
  );
}
