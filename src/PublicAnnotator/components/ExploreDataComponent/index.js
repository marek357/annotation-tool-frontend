import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getProjectEntries } from "../../../features/public-annotator/thunk";

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
];

export default function ExploreDataComponent({ projectURL, type }) {
  const dispatch = useDispatch();
  var data = useSelector((state) => state.publicAnnotator.annotated).map(
    (element) => ({ ...element, value: JSON.stringify(element.value) })
  );
  // if (type === "Machine Translation") {
  //   data = data.map((element) => ({
  //     ...element,
  //     fluency: element.payload.fluency,
  //     adequacy: element.payload.adequacy,
  //     value: JSON.stringify(element.value),
  //   }));
  // }

  console.log(data);

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
