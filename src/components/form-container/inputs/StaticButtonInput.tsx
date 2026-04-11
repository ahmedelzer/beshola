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
    setChild = null, // Received from RequestActionsButtons
  } = props;

  const { control, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dependenceRow, setDependenceRow] = useState({});
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);

  const postAction =
    _schemaActions?.find(
      (action) => action.dashboardFormActionMethodType === "Post",
    ) || null;

  const { dispatch, setCurrentSkip } = usePreloadList({
    idField: fieldName,
    schemaActions: isModalVisible ? _schemaActions || [] : [],
    row: { ...rowDetails },
    deps: [rowDetails, isModalVisible],
  });

  useEffect(() => {
    dispatch({
      type: "RESET_SERVICE_LIST",
      payload: { lastQuery: "" },
    });
    setCurrentSkip((prev) => prev + 1);
  }, [dependenceRow]);

  function setValueCallback(name, value) {
    setDependenceRow({ [name]: value });
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await handleSubmitWithCallback({
        data: { ...data, ...props?.rowDetails },
        setDisable,
        action: postAction,
        proxyRoute: postAction?.projectProxyRoute,
        setReq: setReqError,
        onSuccess: (resultData) => {
          setIsModalVisible(false);
          if (setChild) setChild(null); // Clear the popover child on success
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (!enable) return;

    // IF setChiled exists, we "inject" the form into the popover instead of opening a new Modal
    if (setChild) {
      setChild(
        <View style={{ padding: 10, minWidth: 250 }}>
          <Text
            style={{ fontWeight: "bold", marginBottom: 10, color: theme.body }}
          >
            {title}
          </Text>
          <PopupModal
            isOpen={true}
            onClose={() => setChild(null)}
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
            childSchema={schema}
            isFormModal={schema.schemaType !== "FilesContainer"}
            // Pass a prop to PopupModal to hide its internal Modal wrapper if needed
            embedded={true}
          />
        </View>,
      );
    } else {
      // Fallback to standard Modal behavior
      setIsModalVisible(true);
    }
  };

  const iconName = iconMap[props?.dashboardFormSchemaParameterID] || "circle";

  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity
        disabled={!enable}
        onPress={handlePress}
        className={
          "p-2 rounded-xl flex-row items-center justify-center gap-1 flex-1 " +
          additionClassName
        }
        style={{ backgroundColor: theme.accent, opacity: enable ? 1 : 0.5 }}
      >
        {withLabel && (
          <Text className="!text-xs font-semibold text-body text-center items-center">
            {title}
          </Text>
        )}
        <FontAwesome5 name={iconName} size={14} color={theme.body} />
      </TouchableOpacity>

      {/* ✅ Standard Popup (Only used if NOT in a popover menu) */}
      {isModalVisible && !setChild && (
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
          childSchema={schema}
          isFormModal={schema.schemaType !== "FilesContainer"}
        />
      )}
    </View>
  );
};

export default StaticButtonInput;
