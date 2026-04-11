import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { onApply } from "../../form-container/OnApply";
import AssetsSchemaActions from "../../../Schemas/MenuSchema/AssetsSchemaActions.json";
import { theme } from "../../../Theme";
import { isRTL } from "../../../utils/operation/isRTL";
import { useDeviceInfo } from "../../../utils/component/useDeviceInfo";
export default function AddReqButton({
  item,
  isRequested,
  additionClassName,
}: any) {
  const postAction = AssetsSchemaActions.find(
    (action) => action.dashboardFormActionMethodType === "Post",
  );
  const { width } = useDeviceInfo();
  // define breakpoint (you can tweak it)
  const isSmallScreen = width < 640;
  return (
    <TouchableOpacity
      className={`p-2 ${isRTL() ? "flex-row-reverse" : "flex-row-reverse"} gap-1 flex-row rounded-xl items-center justify-center ${additionClassName || ""}`}
      style={{ backgroundColor: theme.accent }}
      onPress={async () => {
        if (isRequested) return;
        const apply = await onApply(
          item,
          "",
          true,
          postAction,
          postAction.projectProxyRoute,
        );
        console.log("apply", apply);
      }}
    >
      <Text className={"text-body text-xs"}>
        {isRequested ? "Requested" : "Request"}
      </Text>
      <AntDesign
        name={isRequested ? "checkcircle" : "form"}
        size={isSmallScreen ? 16 : 22}
        color={theme.body}
      />
    </TouchableOpacity>
  );
}
