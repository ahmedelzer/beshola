import { View, Text, TouchableOpacity, Share, Platform } from "react-native";
import React, { useContext } from "react";
import { theme } from "../../Theme";
import { Feather } from "@expo/vector-icons";
import { DOMAIN_NAME } from "../shared";
import { CompareContext } from "../../../context/CompareProvider";

export default function PropertyCardButtonsActions({
  widthBorder = false,
  additionClassName,
  item,
  fieldsType,
}: {
  widthBorder?: boolean;
  additionClassName?: string;
  item: any;
  fieldsType: any;
}) {
  const { compareItems, setCompareItems, handleCompareToggle } =
    useContext(CompareContext);

  const itemId = item?.[fieldsType.idField];

  const isCompareItem = compareItems.some(
    (compareItem: any) => compareItem?.[fieldsType.idField] === itemId,
  );

  // ================= SHARE =================
  const handleShare = async () => {
    try {
      const url = `${DOMAIN_NAME}/property/${itemId}`;

      await Share.share(
        Platform.OS === "web"
          ? {
              title: "Check this property",
              text: "Check this property",
              url,
            }
          : {
              message: `Check this property:\n${url}`,
              url,
            },
      );
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const containerClassName = `
    ${widthBorder ? "border-2 p-1" : ""}
    flex-row rounded-t-xl gap-x-2 z-20 w-full
    ${additionClassName}
  `;

  return (
    <View
      className={containerClassName}
      style={{
        backgroundColor: theme.body,
        borderColor: theme.border,
        justifyContent: "flex-end",
      }}
    >
      {/* ================= COMPARE BUTTON ================= */}
      <TouchableOpacity
        onPress={() => {
          handleCompareToggle(item, fieldsType);
        }}
        className="px-3 py-1 flex-row justify-center items-center rounded-full shadow"
        style={{
          backgroundColor: isCompareItem ? theme.accent : theme.surface,
          borderWidth: 1,
          borderColor: isCompareItem ? theme.accent : theme.surface,
        }}
      >
        <Text
          className="text-[10px] font-semibold"
          style={{
            color: isCompareItem ? theme.dark_card : theme.dark_card,
          }}
        >
          +Compare
        </Text>
      </TouchableOpacity>

      {/* ================= SHARE ================= */}
      <TouchableOpacity
        className="p-2 rounded-full shadow"
        style={{ backgroundColor: theme.surface }}
        onPress={handleShare}
      >
        <Feather name="share-2" size={16} color={theme.dark_card} />
      </TouchableOpacity>

      {/* ================= FAVORITE ================= */}
      <TouchableOpacity
        className="p-2 rounded-full shadow"
        style={{ backgroundColor: theme.surface }}
      >
        <Feather name="heart" size={16} color={theme.dark_card} />
      </TouchableOpacity>
    </View>
  );
}
