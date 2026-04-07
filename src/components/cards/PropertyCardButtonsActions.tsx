import { View, Text, TouchableOpacity, Share, Platform } from "react-native";
import React, { useContext } from "react";
import { theme } from "../../Theme";
import { Feather } from "@expo/vector-icons";
import { DOMAIN_NAME } from "../shared";
import { CompareContext } from "../../../context/CompareProvider";
import { addAlpha } from "../../utils/operation/addAlpha";

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
  const { compareItems, handleCompareToggle } = useContext(CompareContext);

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
          ? { title: "Check this property", text: "Check this property", url }
          : { message: `Check this property:\n${url}`, url },
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

  // Standard shadow style object to keep code DRY
  const shadowStyle = (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Necessary for Android shadow color to work
  });

  return (
    <View
      className={containerClassName}
      style={{
        backgroundColor: theme.accent,
        borderColor: theme.border,
        justifyContent: "flex-end",
      }}
    >
      {/* ================= COMPARE BUTTON ================= */}
      <TouchableOpacity
        onPress={() => handleCompareToggle(item, fieldsType)}
        className="px-3 py-1 flex-row justify-center items-center rounded-full"
        style={[
          {
            backgroundColor: isCompareItem 
              ? addAlpha(theme.accent, 0.15) 
              : addAlpha(theme.surface, 0.15),
            borderWidth: 1,
            borderColor: isCompareItem ? theme.accent : theme.surface,
          },
          shadowStyle(isCompareItem ? theme.accent : "#000")
        ]}
      >
        <Text
          className="text-[10px] font-semibold"
          style={{ color: theme.body }}
        >
          {isCompareItem ? "Compared" : "+Compare"}
        </Text>
      </TouchableOpacity>

      {/* ================= SHARE ================= */}
      <TouchableOpacity
        className="p-2 rounded-full"
        style={[
          { backgroundColor: addAlpha(theme.body, 0.15),
            borderWidth: 1,
            borderColor: theme.surface,
           },
          shadowStyle("#000")
        ]}
        onPress={handleShare}
      >
        <Feather name="share-2" size={16} color={theme.body} />
      </TouchableOpacity>

      {/* ================= FAVORITE ================= */}
      <TouchableOpacity
        className="p-2 rounded-full"
        style={[
          { backgroundColor: addAlpha(theme.body, 0.15) ,

            borderWidth: 1,
            borderColor: theme.surface,
          },
          shadowStyle("#000")
        ]}
      >
        <Feather name="star" size={16} color={theme.body} />
      </TouchableOpacity>
    </View>
  );
}