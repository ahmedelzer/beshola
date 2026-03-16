import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import ExpandableText from "../../utils/component/ExpandableText";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";

import { FontAwesome5 } from "@expo/vector-icons";

const iconMap = {
  "985a6440-8efa-4618-ad5f-1698b076e914": "bed",
  "7789ef2a-6553-4656-b9bd-9e9e5c91342b": "bath",
};

const AttributeItem = ({ iconID, fullText }) => {
  const [itemWidth, setItemWidth] = useState(0);

  const calculatedLimit = Math.floor(Math.max(0, itemWidth - 24) / 8);
  const dynamicWidth = getDynamicWidth(fullText, 8.5, 25);

  const iconName = iconMap[iconID] || "circle";

  return (
    <View
      onLayout={(e) => setItemWidth(e.nativeEvent.layout.width)}
      style={{ flexDirection: "row" }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: dynamicWidth,
          maxWidth: 240,
          backgroundColor: addAlpha(theme.accent, 0.3),
          borderWidth: 1,
          borderColor: theme.accent,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Icon */}
        <FontAwesome5
          name={iconName}
          size={14}
          color={theme.accent}
        />

        {/* Text */}
        <ExpandableText
          text={fullText}
          initLimit={(calculatedLimit > 0 ? calculatedLimit : 35) - 5}
          className="text-text text-sm font-medium"
        />
      </TouchableOpacity>
    </View>
  );
};

const Attributes = ({ attributes = [] }) => {
  if (!attributes.length) return null;

  // Set the limit of items to show initially (e.g., 4)
  const initialLimit = 300;
  const displayedAttributes = attributes.slice(0, initialLimit);
  const hasMore = attributes.length > initialLimit;

  return (
    <View style={{ flexDirection: "column", gap: 8, width: "100%" }}>
  {displayedAttributes.map((attr, index) => {
    const parts = attr.split("{,}");

    const iconID = parts[0]?.trim() || "";
    const label = parts[1]?.trim() || "";
    const value = parts[2]?.trim() || "";

    const fullText = value ? `${value}` : label;

    return (
      <AttributeItem
        key={`${iconID}-${index}`}
        iconID={iconID}
        label={label}
        value={value}
        fullText={fullText}
      />
    );
  })}

  {/* Footer "Show More" Button */}
  {hasMore && (
    <TouchableOpacity
      style={{
        marginTop: 4,
        paddingVertical: 4,
        alignSelf: "flex-start",
      }}
      onPress={() => {
        console.log("Show all attributes pressed");
      }}
    >
      <Text
        style={{
          color: theme.accent,
          fontSize: 14,
          fontWeight: "bold",
          textDecorationLine: "underline",
        }}
      >
        Show {attributes.length - initialLimit} more attributes...
      </Text>
    </TouchableOpacity>
  )}
</View>
  );
};

export default Attributes;
