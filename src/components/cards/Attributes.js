import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import ExpandableText from "../../utils/component/ExpandableText";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";
import { FontAwesome5 } from "@expo/vector-icons";
import { iconMap } from "../../utils/operation/getIconWithID";

// ================== SUB-COMPONENT: ATTRIBUTE PILL ==================
const AttributeItem = ({ iconID, fullText, variant }) => {
  const [itemWidth, setItemWidth] = useState(0);
  const isSmall = variant === "small";

  // Dynamic sizing based on variant
  const calculatedLimit = Math.floor(Math.max(0, itemWidth - (isSmall ? 16 : 24)) / 8);
  const dynamicWidth = getDynamicWidth(fullText, isSmall ? 7 : 8.5, isSmall ? 15 : 25);
  const iconName = iconMap[iconID] || "circle";

  return (
    <View
      onLayout={(e) => setItemWidth(e.nativeEvent.layout.width)}
      style={{ flexDirection: "row", marginBottom: isSmall ? 4 : 8 }}
    >
      <View
        style={{
          width: dynamicWidth,
          maxWidth: isSmall ? 180 : 240,
          backgroundColor: addAlpha(theme.accent, 0.2),
          borderWidth: 1,
          borderColor: theme.accent,
          borderRadius: isSmall ? 6 : 8,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 4 : 6,
          flexDirection: "row",
          alignItems: "center",
          gap: isSmall ? 4 : 6,
        }}
      >
        <FontAwesome5 name={iconName} size={isSmall ? 10 : 14} color={theme.accent} />
        <ExpandableText
          text={fullText}
          initLimit={(calculatedLimit > 0 ? calculatedLimit : (isSmall ? 20 : 35)) - 5}
          className={`text-text font-medium ${isSmall ? "text-[10px]" : "text-sm"}`}
        />
      </View>
    </View>
  );
};

// ================== MAIN COMPONENT ==================
const Attributes = ({
  Attributes = [],
  isCompact = false,
  initialLimit = 2,
  openMode = false, // If true, shows full list immediately (like openingList)
  variant = "",     // "small" for compact card displays
}) => {
  const [showModal, setShowModal] = useState(false);
console.log("watch attributes",attributes)
  if (!attributes || attributes.length === 0) return <Text>
    {"No attributes"}
  </Text>;

  const displayedAttributes = attributes.slice(0, initialLimit);
  const hasMore = attributes.length > initialLimit;

  const getText = (attr) => {
    const parts = attr.split("{,}");
    const label = parts[1]?.trim() || "";
    const value = parts[2]?.trim() || "";
    return value || label;
  };

  const getIcon = (attr) => attr.split("{,}")[0]?.trim() || "";

  // Helper to render the vertical list used in Modal and openMode
  const RenderVerticalList = ({ items }) => (
    <View style={{ flexDirection: "column" }}>
      {items.map((attr, index) => (
        <AttributeItem
          key={index}
          iconID={getIcon(attr)}
          fullText={getText(attr)}
          variant={variant}
        />
      ))}
    </View>
  );

  // If openMode is true, render the full list directly (no interaction needed)
  if (openMode) {
    return <RenderVerticalList items={attributes} />;
  }

  return (
    <View style={{ width: "100%" }}>
      {/* ================== MAIN VIEW / TRIGGER ================== */}
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => setShowModal(true)}
      >
        {isCompact ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pointerEvents="none" // Allows touch to pass through to TouchableOpacity
            contentContainerStyle={{ alignItems: "center", paddingVertical: 4 }}
          >
          <RenderVerticalList items={displayedAttributes} />
          </ScrollView>
        ) : (
          <RenderVerticalList items={displayedAttributes} />
        )}
      </TouchableOpacity>

      {/* ================== MODAL ================== */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <Text style={styles.modalHeader}>All Attributes</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
              <RenderVerticalList items={attributes} />
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: theme.body,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: theme.accent,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: theme.body,
    fontWeight: "bold",
  },
});

export default Attributes;