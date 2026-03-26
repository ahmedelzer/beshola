import { useContext, useState } from "react";
import { View } from "react-native";

// import DuringTransactionContainer from "../PartingFrom/DuringTransactionContainer";
// import FilesWithButtonPaging from "../PartingFrom/fileInput/FilesWithButtonPaging";
// import FilesWithScrollPaging from "../PartingFrom/fileInput/FilesWithScrollPaging";
// import StaticFilesModel from "../PartingFrom/fileInput/StaticFilesModel";
import { useSelector } from "react-redux";
import GetActionsFromSchema from "../../../../../components/hooks/DashboardAPIs/GetActionsFromSchema";
import { IsSecondListSubsetOfFirstList } from "../../../../utils/operation/IsSecondListSubsetOfFirstList";
import { Button, ButtonText } from "../../../../../components/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingScreen from "../../../../kitchensink-components/loading/LoadingScreen";
import { Chase, Flow } from "react-native-animated-spinkit";
import FilesWithScrollPaging from "./FilesWithScrollPaging";

function FileContainer({
  parentSchemaParameters,
  schema,
  row,
  title,
  serverSchema,
}) {
  const localization = useSelector((state) => state.localization.localization);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [proxyRoute, setProxyRoute] = useState("");
  const [selectedServerFiles, setSelectedServerFiles] = useState([]);
  const [automated, setAutomated] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [selectPostAction, setSelectPostAction] = useState({});
  const [modalFileIsOpen, setModalFileIsOpen] = useState(false);
  const [selectedFilesContext, setSelectedFilesContext] = useState([]);
  const [open, setOpen] = useState(false);

  const idField = schema.idField;

  const fileFieldNameButtonPaging = schema.dashboardFormSchemaParameters.find(
    (field) => field.parameterType === "imagePath",
  )?.parameterField;

  const fileFieldNameScrollPaging =
    serverSchema.dashboardFormSchemaParameters.find(
      (field) => field.parameterType === "image",
    )?.parameterField;

  const schemaWithoutID = schema.dashboardFormSchemaParameters.filter(
    (schema) => !schema.isIDField,
  );

  const {
    getAction: getActionServerSchema,
    postAction: postActionServerSchema,
  } = GetActionsFromSchema(serverSchema);

  const {
    getAction: getActionSchema,
    postAction: postActionSchema,
    deleteAction: deleteActionSchema,
    isLoading,
  } = GetActionsFromSchema(schema);

  const isSubset = IsSecondListSubsetOfFirstList(
    parentSchemaParameters,
    schemaWithoutID,
    ["parameterField"],
  );

  const RefreshFiles = () => {
    setTrigger((prev) => prev + 1);
  };

  function handleUpload(postAction, files, route) {
    setSelectPostAction(postAction);

    if (files.length > 0) {
      const mapped = files.map((file) => ({
        ...file,
        ...row,
      }));

      setSelectedFilesContext(mapped);
      setProxyRoute(route);
    }

    setOpen(!isSubset);
    setAutomated(isSubset);

    setSelectedFiles([]);
    setSelectedServerFiles([]);
  }

  function handleDelete(postAction, files, route) {
    setSelectPostAction(postAction);

    if (files.length > 0) {
      setSelectedFilesContext(files);
      setProxyRoute(route);
    }

    setOpen(!isSubset);
    setAutomated(isSubset);

    setSelectedFiles([]);
    setSelectedServerFiles([]);
  }

  return (
    <View className="p-3" key={trigger}>
      {selectedFilesContext.length > 0 && (
        <LoadingScreen LoadingComponent={<Chase size={40} />} />
      )}

      {/* <StaticFilesModel
        modalFileIsOpen={modalFileIsOpen}
        setModalFileIsOpen={setModalFileIsOpen}
        setSelectedFiles={setSelectedFiles}
        title={title}
        fieldName={fileFieldNameScrollPaging}
        row={row}
        postAction={postActionServerSchema}
        handleUpload={() =>
          handleUpload(
            postActionServerSchema,
            selectedFiles,
            serverSchema.projectProxyRoute,
          )
        }
        selectedFiles={selectedFiles}
      /> */}

      {/* Buttons */}
      <View className="flex-row gap-2 my-2">
        {postActionServerSchema && (
          <Button onPress={() => setModalFileIsOpen(true)}>
            <MaterialCommunityIcons name="file-plus" size={24} color="black" />
          </Button>
        )}

        {postActionSchema && (
          <Button
            onPress={() =>
              handleUpload(
                postActionSchema,
                selectedServerFiles,
                schema.projectProxyRoute,
              )
            }
          >
            <ButtonText>
              {localization.fileContainer.textButtonUploadValue}
            </ButtonText>
          </Button>
        )}
      </View>

      {isLoading && <LoadingScreen LoadingComponent={<Flow size={40} />} />}

      {!isLoading && getActionServerSchema && (
        <FilesWithScrollPaging
          title={title}
          idField={serverSchema.idField}
          row={row}
          proxyRoute={serverSchema.projectProxyRoute}
          getAction={getActionServerSchema}
          selectedServerFiles={selectedServerFiles}
          setSelectedServerFiles={setSelectedServerFiles}
          fileFieldName={fileFieldNameScrollPaging}
        />
      )}

      {/* {!isLoading && getActionSchema && (
        <FilesWithButtonPaging
          title={title}
          idField={idField}
          row={row}
          getAction={getActionSchema}
          deleteAction={deleteActionSchema}
          handleToDelete={() => console.log("delete")}
          fileFieldName={fileFieldNameButtonPaging}
        />
      )}

      <DuringTransactionContainer
        tableSchema={schema}
        TransformDone={RefreshFiles}
        automated={automated}
        selectionContext={selectedFilesContext}
        open={open}
        setOpen={setOpen}
        proxyRoute={proxyRoute}
        action={selectPostAction}
        setSelectionContext={setSelectedFilesContext}
      /> */}
    </View>
  );
}

export default FileContainer;
