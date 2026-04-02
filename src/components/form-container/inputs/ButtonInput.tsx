import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button, View, Text, TouchableOpacity, FlatList } from "react-native";

import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import GetSchemaUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";

import reducer from "../../Pagination/reducer";
import { initialState, VIRTUAL_PAGE_SIZE } from "../../Pagination/initialState";
import { createRowCache } from "../../Pagination/createRowCache";
import { buildApiUrl } from "../../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../Pagination/updateRows";
import PopupModal from "../../../utils/component/PopupModal";
import { useForm } from "react-hook-form";
import { handleSubmitWithCallback } from "../../../utils/operation/handleSubmitWithCallback";
import { addAlpha } from "../../../utils/operation/addAlpha";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../Theme";
import { iconMap } from "../../../utils/operation/getIconWithID";
import FileContainer from "./CustomInputs/FileContainer";
import DisplayFilesServerSchema from "./../../../Schemas/MenuSchema/DisplayFilesServerSchema.json";
import PricePlanSchema from "./../../../Schemas/MenuSchema/PricePlanSchema.json";
import PricePlan from "../../cards/PricePlan";
import { getField } from "../../../utils/operation/getField";
import TableCard from "../../cards/TableCard";
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

  // ✅ Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);
  const [row, setRow] = useState({});
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

  const getAction =
    _schemaActions?.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    ) || null;
  const postAction =
    _schemaActions?.find(
      (action) => action.dashboardFormActionMethodType === "Post",
    ) || null;

  // ✅ Pagination state
  const [state, dispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, fieldName),
  );

  const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

  // ✅ API builder
  const dataSourceAPI = (query, skip, take) =>
    buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      onlineAssetID: "67abea4d-cacf-48c5-92a6-2c628b06799a",
      ...rowDetails,
    });

  // ✅ Load data
  useEffect(() => {
    if (!getAction || !isModalVisible) return;
    console.log("====================================");
    console.log(rowDetails, "rowDetails state");
    console.log("====================================");
    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction, isModalVisible]);
  const onSubmit = async (data) => {
    try {
      await handleSubmitWithCallback({
        data,
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

  const pricePlanFieldsType = {
    idField: PricePlanSchema.idField,
    name: getField(parameters, "onlineAssetPricePlanName", false),
    currencyShortName: getField(parameters, "currencyTypeShortName", false),

    startDate: getField(parameters, "startTime", false),
    endDate: getField(parameters, "endTime", false),

    totalPrice: getField(parameters, "totalPrice", false),
    downPayment: getField(parameters, "downPayment", false),
    discount: getField(parameters, "discountPercentage", false),
    cashback: getField(parameters, "cashbackAmount", false),

    maintenanceFees: getField(parameters, "maintenanceFees", false),
    insuranceFees: getField(parameters, "insuranceFees", false),
    tax: getField(parameters, "taxPercentage", false),

    remarks: getField(parameters, "remarks", false),
  };
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
          schema={schema}
          onSubmit={handleSubmit(onSubmit)}
          errors={reqError || errors}
          disable={loading}
          setValue={setValue}
          key={row?.[schema?.idField]} // Reset form when a different row is selected
          // parentSchema={parentSchema}
          childSchema={schema}
          isFormModal={schema?.schemaType !== "FilesContainer"}
        >
          <SelectForm
            schemaType={schema?.schemaType}
            row={rowDetails}
            schema={schema}
            serverSchema={DisplayFilesServerSchema}
            title={title}
            setRow={setRow}
            rows={
              state.rows.length > 0
                ? state.rows
                : [
                    {
                      onlineAssetPricePlanID:
                        "a8a76a1d-709e-4b66-88cc-610f394758c0",
                      createdOn: "2026-03-11T04:53:15",
                      isActive: false,
                      currencyTypeShortName: null,
                      installmentsTotal: 0,
                      onlineAssetID: "6102f88f-7be3-41d0-bac5-91a50305f51c",
                      totalPrice: 5000000,
                      downPayment: 500000,
                      discountPercentage: 10,
                      cashbackAmount: 500000,
                      currencyTypeID: "927c3630-f9d2-49e7-b570-a8db50ff5b69",
                      startDate: "0001-01-01T00:00:00",
                      endDate: "0001-01-01T00:00:00",
                      showOnline: true,
                      maintenanceFees: 10000,
                      insuranceFees: 100000,
                      taxPercentage: 14,
                      remarks: "dsdas",
                      onlineAssetPricePlanName: "test12",
                    },
                  ]
            }
          />
        </PopupModal>
      )}
    </View>
  );
};
function SelectForm({ schemaType, ...props }) {
  switch (schemaType) {
    // case "PricePlan":
    //   return <FlatList data={props.rows} renderItem={TableCard} {...props} />;
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
