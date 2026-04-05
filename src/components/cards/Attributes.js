import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import ExpandableText from "../../utils/component/ExpandableText";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";

import { FontAwesome5 } from "@expo/vector-icons";
import { iconMap } from "../../utils/operation/getIconWithID";

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
        <FontAwesome5 name={iconName} size={14} color={theme.accent} />

        <ExpandableText
          text={fullText}
          initLimit={(calculatedLimit > 0 ? calculatedLimit : 35) - 5}
          className="text-text text-sm font-medium"
        />
      </TouchableOpacity>
    </View>
  );
};

const Attributes = ({
  attributes = [],
  isCompact = false,
  initialLimit = 1,
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!attributes.length) return null;

  const displayedAttributes = attributes.slice(0, initialLimit);
  const hasMore = attributes.length > initialLimit;

  const getText = (attr) => {
    const parts = attr.split("{,}");
    const label = parts[1]?.trim() || "";
    const value = parts[2]?.trim() || "";
    return value || label;
  };

  return (
    <View style={{ width: "100%" }}>
      {/* ================== MAIN VIEW ================== */}
      {isCompact ? (
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{
    alignItems: "center",
  }}
>
  <Text
    style={{
      fontSize: 14,
      color: theme.text,
      whiteSpace: "nowrap", // safe for web
    }}
  >
    {displayedAttributes.map(getText).join(" | ")}
  </Text>
</ScrollView>
      ) : (
        <View style={{ flexDirection: "column", gap: 8 }}>
          {displayedAttributes.map((attr, index) => {
            const parts = attr.split("{,}");
            const iconID = parts[0]?.trim() || "";
            const fullText = getText(attr);

            return (
              <AttributeItem
                key={`${iconID}-${index}`}
                iconID={iconID}
                fullText={fullText}
              />
            );
          })}
        </View>
      )}

      {/* ================== SHOW MORE BUTTON ================== */}
      {hasMore && (
        <TouchableOpacity
          style={{
            marginTop: 4,
            paddingVertical: 4,
            alignSelf: "flex-start",
          }}
          onPress={() => setShowModal(true)}
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

      {/* ================== MODAL ================== */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        {/* Overlay */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Prevent closing when clicking inside */}
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: "90%",
              maxHeight: "70%",
              backgroundColor: theme.body,
              borderRadius: 12,
              padding: 16,
            }}
          >
            {/* Header */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              All Attributes
            </Text>

            {/* List */}
            <ScrollView>
              <View style={{ flexDirection: "column", gap: 8 }}>
                {attributes.map((attr, index) => {
                  const parts = attr.split("{,}");
                  const iconID = parts[0]?.trim() || "";
                  const fullText = getText(attr);

                  return (
                    <AttributeItem
                      key={`${iconID}-${index}`}
                      iconID={iconID}
                      fullText={fullText}
                    />
                  );
                })}
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                marginTop: 12,
                padding: 10,
                backgroundColor: theme.accent,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.body, fontWeight: "bold" }}>
                Close
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Attributes;

// const Attributes = ({ attributes = [] }) => {
//   if (!attributes.length) return null;

//   // Set the limit of items to show initially (e.g., 4)
//   const initialLimit = 300;
//   const displayedAttributes = attributes.slice(0, initialLimit);
//   const hasMore = attributes.length > initialLimit;

//   return (
//     <View style={{ flexDirection: "column", gap: 8, width: "100%" }}>
//       {displayedAttributes.map((attr, index) => {
//         const parts = attr.split("{,}");

//         const iconID = parts[0]?.trim() || "";
//         const label = parts[1]?.trim() || "";
//         const value = parts[2]?.trim() || "";

//         const fullText = value ? `${value}` : label;

//         return (
//           <AttributeItem
//             key={`${iconID}-${index}`}
//             iconID={iconID}
//             label={label}
//             value={value}
//             fullText={fullText}
//           />
//         );
//       })}

//       {/* Footer "Show More" Button */}
//       {hasMore && (
//         <TouchableOpacity
//           style={{
//             marginTop: 4,
//             paddingVertical: 4,
//             alignSelf: "flex-start",
//           }}
//           onPress={() => {
//             console.log("Show all attributes pressed");
//           }}
//         >
//           <Text
//             style={{
//               color: theme.accent,
//               fontSize: 14,
//               fontWeight: "bold",
//               textDecorationLine: "underline",
//             }}
//           >
//             Show {attributes.length - initialLimit} more attributes...
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default Attributes;
