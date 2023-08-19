import { CloseIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      {data !== undefined && data !== null && data.length > 0 ? (
        <Button onClick={onOpen}>Delete All</Button>
      ) : null}
      {/* https://chakra-ui.com/docs/components/alert-dialog */}
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete all uploaded entries</AlertDialogHeader>
            <AlertDialogBody>
              This is not reversible, once the operation is performed, the data
              will not be retrievable
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} marginRight={5}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  data.forEach((unannotatedEntry) => {
                    dispatch(
                      deleteUnannotatedProjectEntry([
                        projectURL,
                        unannotatedEntry.id,
                      ])
                    ).then(() => dispatch(getUnannotatedData([projectURL])));
                  });
                  onClose();
                }}
                colorScheme="red"
              >
                Delete All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <DataTable columns={columns(type)} data={data} />
    </>
  );
}
