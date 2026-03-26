import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";

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
import { FontAwesome5 } from "@expo/vector-icons";
import { theme } from "../../../Theme";
import { iconMap } from "../../../utils/operation/getIconWithID";
import FileContainer from "./CustomInputs/FileContainer";
import DisplayFilesServerSchema from "./../../../Schemas/MenuSchema/DisplayFilesServerSchema.json";

const ButtonInput = (props) => {
  const { title = "Open", fieldName, enable, parentSchema = {} } = props;
  const { control, handleSubmit, formState } = useForm();
  const { errors } = formState;
  // ✅ Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);

  // ✅ Fetch schema
  const { data: schema } = useFetch(
    GetSchemaUrl(props.lookupID),
    defaultProjectProxyRouteWithoutBaseURL,
  );

  // ✅ Fetch actions
  const { data: _schemaActions } = useFetch(
    GetSchemaActionsUrl(props.lookupID),
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
      ...props?.rowDetails,
    });

  // ✅ Load data
  useEffect(() => {
    if (!getAction) return;

    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction]);
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
        <Text className="!text-xs font-semibold text-body">{title}</Text>
        <FontAwesome5 name={iconName} size={14} color={theme.body} />
      </TouchableOpacity>

      {/* ✅ Popup */}
      {isModalVisible && (
        <PopupModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          headerTitle={title}
          row={state.rows || {}}
          control={control}
          schema={schema}
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          disable={loading}
          parentSchema={parentSchema}
          childSchema={schema}
          isFormModal={schema.schemaType !== "FilesContainer"}
        >
          {schema.schemaType === "FilesContainer" && (
            <FileContainer
              parentSchemaParameters={
                parentSchema?.dashboardFormSchemaParameters
              }
              row={{}}
              schema={schema}
              serverSchema={DisplayFilesServerSchema}
              title={title}
            />
          )}
        </PopupModal>
      )}
    </View>
  );
};

export default ButtonInput;
