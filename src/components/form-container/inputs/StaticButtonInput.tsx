import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { theme } from "../../../Theme";
import PopupModal from "../../../utils/component/PopupModal";
import { iconMap } from "../../../utils/operation/getIconWithID";
import { handleSubmitWithCallback } from "../../../utils/operation/handleSubmitWithCallback";
import { usePreloadList } from "../../Pagination/usePreloadList";
const StaticButtonInput = (props) => {
  const {
    title = "Open",
    fieldName,
    enable,
    withLabel = true,
    schema,
    _schemaActions,
    rowDetails = {},
    additionClassName = "",
  } = props;
  const { control, handleSubmit, formState, watch, setValue } = useForm();
  const { errors } = formState;
  // ✅ Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rootRow, setRootRow] = useState(rowDetails || {});
  const [dependenceRow, setDependenceRow] = useState({});
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);
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
    dispatch,
    setCurrentSkip,
  } = usePreloadList({
    idField: fieldName,
    schemaActions: isModalVisible ? _schemaActions || [] : [],
    row: {
      ...rowDetails,
    },
    deps: [rowDetails, isModalVisible],
  });
  useEffect(() => {
    // if (rootRow[fieldName]) {
    dispatch({
      type: "RESET_SERVICE_LIST",
      payload: { lastQuery: "" },
    });

    setCurrentSkip((prev) => prev + 1);
    // }
  }, [dependenceRow]);
  function setValueCallback(name, value) {
    setDependenceRow({ ...{ [name]: value } });
  }
  // useEffect(() => {
  //   const subscription = watch((formValues) => {
  //     // Clean object is optional if you want to remove empty/undefined values
  //     const cleanedValues = cleanObject(formValues);
  // console.log("====================================");
  // console.log(cleanedValues, state.rows, "rootRow from buttonInput1");
  // console.log("====================================");
  //     setRootRow({ ...rootRow, ...cleanedValues });
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch]);
  const onSubmit = async (data) => {
    console.log(data, "data");

    try {
      await handleSubmitWithCallback({
        data: { ...data, ...props?.rowDetails },
        setDisable,
        action: postAction,
        proxyRoute: postAction?.projectProxyRoute,
        setReq: setReqError,
        onSuccess: (resultData) => {
          setIsModalVisible(false);
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
    }
  };
  const iconName = iconMap[props?.dashboardFormSchemaParameterID] || "circle";
  return (
    <View className="w-full" style={{ width: "100%" }}>
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
        className={
          "p-2 rounded-xl flex-row items-center justify-center gap-1 flex-1 " +
          additionClassName
        }
        style={{ backgroundColor: theme.accent }}
      >
        {/* Icon */}
        {withLabel && (
          <Text className="!text-xs font-semibold text-body text-center items-center">
            {title}
          </Text>
        )}
        <FontAwesome5 name={iconName} size={14} color={theme.body} />
      </TouchableOpacity>

      {/* ✅ Popup */}
      {isModalVisible && (
        <PopupModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          headerTitle={title}
          row={rowDetails}
          control={control}
          schemaActions={_schemaActions}
          parentRow={rowDetails}
          schema={schema}
          onSubmit={handleSubmit(onSubmit)}
          errors={reqError || errors}
          disable={loading}
          setValue={setValueCallback}
          // parentSchema={parentSchema}
          childSchema={schema}
          isFormModal={schema.schemaType !== "FilesContainer"}
        >
          {/* {schema.schemaType === "FilesContainer" && (
            <FileContainer
              row={{}}
              schema={schema}
              serverSchema={DisplayFilesServerSchema}
              title={title}
            />
          )} */}
        </PopupModal>
      )}
    </View>
  );
};

export default StaticButtonInput;
