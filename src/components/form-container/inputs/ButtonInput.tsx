import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import GetSchemaUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";

import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { theme } from "../../../Theme";
import DynamicTreeSchema from "../../../utils/component/DynamicTreeSchema";
import PopupModal from "../../../utils/component/PopupModal";
import { iconMap } from "../../../utils/operation/getIconWithID";
import { handleSubmitWithCallback } from "../../../utils/operation/handleSubmitWithCallback";
import TableCard from "../../cards/TableCard";
import { usePreloadList } from "../../Pagination/usePreloadList";
import DisplayFilesServerSchema from "./../../../Schemas/MenuSchema/DisplayFilesServerSchema.json";
import PricePlanSchema from "./../../../Schemas/MenuSchema/PricePlanSchema.json";
import FileContainer from "./CustomInputs/FileContainer";
const attributeSchema = {
  dashboardFormSchemaID: "6cb949c3-71fc-4a0f-b841-2fcc9534f395",
  idField: "attributeValueID",
  dashboardFormSchemaInfoDTOView: {
    dashboardFormSchemaID: "6cb949c3-71fc-4a0f-b841-2fcc9534f395",
    schemaHeader: "General Attributes",
    addingHeader: "Add General Attributes",
    editingHeader: "Edit General Attributes",
  },
  dashboardFormSchemaParameters: [
    {
      dashboardFormSchemaParameterID: "87c2266c-2edc-4f38-a2d4-2c499324a105",
      dashboardFormSchemaID: "6cb949c3-71fc-4a0f-b841-2fcc9534f395",
      isEnable: true,
      parameterType: "treeLeaf",
      parameterField: "attributeValueID",
      parameterTitel: "Attribute Value ID",
      parameterLookupTitel: null,
      isIDField: true,
      lookupID: "7f1e9302-b9fe-4c96-84a1-4fa348462eeb",
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 1,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
    {
      dashboardFormSchemaParameterID: "param-price-minmax",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
      isEnable: true,
      parameterType: "tree",
      parameterField: "attributes",
      parameterTitel: "attributes",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
  ],
  projectProxyRoute: "BrandingMartDefinitions",
};
const ButtonInput = (props) => {
  const {
    title = "Open",
    fieldName,
    enable,
    withLabel = true,
    staticSchema,
    rowDetails = {},
  } = props;
  const filtersMap = new Map([]);
  // ✅ Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);
  const [row, setRow] = useState(rowDetails);
  const { control, handleSubmit, formState, setValue } = useForm({
    defaultValues: row,
  });
  const { errors, defaultValues } = formState;
  // ✅ Fetch schema
  const { data: schema } =
    useFetch(
      isModalVisible ? GetSchemaUrl(props.lookupID) : null,
      defaultProjectProxyRouteWithoutBaseURL,
    ) || attributeSchema;
  // const schema = attributeSchema;

  // ✅ Fetch actions
  const { data: _schemaActions } = useFetch(
    isModalVisible ? GetSchemaActionsUrl(props.lookupID) : null,
    defaultProjectProxyRouteWithoutBaseURL,
  );
  const postAction =
    _schemaActions?.find(
      (action) => action.dashboardFormActionMethodType === "Post",
    ) || null;
  const {
    rows,
    totalCount,
    handleScroll,
    // dispatch: reducerDispatch,
    state,
  } = usePreloadList({
    idField: fieldName,
    schemaActions: _schemaActions || [],
    PrepareLoadValidation: () => {
      return isModalVisible;
    },
    row: {
      ...rowDetails,
    },
    deps: [rowDetails, isModalVisible],
  });
  const onSubmit = async (data) => {
    try {
      await handleSubmitWithCallback({
        data: { ...rowDetails, ...data },
        setDisable,
        action: postAction,
        proxyRoute: postAction?.projectProxyRoute,
        setReq: setReqError,
        onSuccess: (resultData) => {
          // AddAddressLocation(resultData);
          // setIsModalVisible(false);
          // dispatch(updateSelectedLocation(resultData));
          // setSelectedLocation(resultData);
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };
  const iconName = iconMap[props?.dashboardFormSchemaParameterID] || "circle";
  const parameters = PricePlanSchema.dashboardFormSchemaParameters;
  return (
    <View>
      {/* ✅ Button */}
      {/* <Button
        title={title}
        disabled={!enable}
        onPress={() => setIsModalVisible(true)}
      /> */}
      <TouchableOpacity
        disabled={!enable}
        onPress={() => {
          setIsModalVisible(true);
        }}
        className="p-2 rounded-xl mb-2 flex-row gap-1"
        style={{ backgroundColor: theme.accent }}
      >
        {/* Icon */}
        {withLabel && (
          <Text className="!text-xs font-semibold text-body">{title}</Text>
        )}
        <FontAwesome5 name={iconName} size={14} color={theme.body} />
      </TouchableOpacity>

      {/* ✅ Popup */}
      {isModalVisible && (
        <PopupModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          headerTitle={title}
          row={row}
          control={control}
          schema={schema?.schemaType === "Tree" ? {} : schema}
          onSubmit={handleSubmit(onSubmit)}
          errors={reqError || errors}
          disable={loading}
          setValue={setValue}
          key={row?.[schema?.idField]} // Reset form when a different row is selected
          // parentSchema={parentSchema}
          childSchema={schema}
          isFormModal={schema?.schemaType !== "FilesContainer"}
          haveFooter={schema?.schemaType !== "FilesContainer"}
        >
          <SelectForm
            filtersMap={filtersMap}
            schemaType={schema?.schemaType}
            row={rowDetails}
            schema={schema}
            rows={state.rows}
            serverSchema={DisplayFilesServerSchema}
            title={title}
            setRow={setRow}
            setValue={setValue}
            fieldName={fieldName}
          />
        </PopupModal>
      )}
    </View>
  );
};
function SelectForm({ schemaType, ...props }) {
  switch (schemaType) {
    case "Tree":
      return (
        <DynamicTreeSchema
          fieldName={props.fieldName}
          setValue={props.setValue}
        />
      );
    case "FilesContainer":
      return <FileContainer {...props} />;
    default:
      return (
        <View className="flex flex-row items-start border border-accent rounded-lg p-2">
          <TouchableOpacity
            className="p-2 w-fit rounded-lg bg-accent items-center justify-center me-2"
            // onPress={() => setIsModalVisible(true)}
            onPress={() => props.setRow({})}
          >
            <Entypo name="plus" size={15} className="!text-body" />
          </TouchableOpacity>
          <FlatList
            data={props.rows}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <TableCard item={item} {...props} />}
            {...props}
          />
        </View>
      );
  }
}
export default ButtonInput;
