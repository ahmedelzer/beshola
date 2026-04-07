import { View, Text } from "react-native";
import React from "react";
import AddReqButton from "./AddReqButton";
import RequestActionsButtons from "./RequestActionsButtons";

export default function AssetActionButton({
  isRequested,
  item,
  additionClassName,
  styleType = "menuPopup",
}: any) {
  return (
    <>
      {isRequested && (
        <RequestActionsButtons
          item={item}
          styleType={styleType}
          additionClassName={additionClassName}
        />
      )}
      {!isRequested && (
        <AddReqButton
          item={item}
          isRequested={isRequested}
          additionClassName={additionClassName}
        />
      )}
    </>
  );
}
