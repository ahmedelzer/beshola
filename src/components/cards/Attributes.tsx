import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import ExpandableText from "../../utils/component/ExpandableText";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";
import { FontAwesome5 } from "@expo/vector-icons";
import { iconMap } from "../../utils/operation/getIconWithID";

const AttributeItem = ({ iconID, fullText,variant }) => {
  const [itemWidth, setItemWidth] = useState(0);
  const calculatedLimit = Math.floor(Math.max(0, itemWidth - 24) / 8);
  const dynamicWidth = getDynamicWidth(fullText, 8.5, 25);
  const iconName = iconMap[iconID] || "circle";

  return (
    <View
      onLayout={(e) => setItemWidth(e.nativeEvent.layout.width)}
      style={{ flexDirection: "row" }}
    >
      <View
        style={{
          width: dynamicWidth,
          maxWidth: 240,
          backgroundColor: addAlpha(theme.accent, 0.2),
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
        <FontAwesome5 name={iconName} size={variant === "small" ? 8 : 14} color={theme.accent} />
        <ExpandableText
        fontSize={variant === "small" ? 8 : 14}
          text={fullText}
          initLimit={(calculatedLimit > 0 ? calculatedLimit : 35) - 5}
          className="text-text  "
        />
      </View>
    </View>
  );
};

const Attributes = ({
  attributes = [],
  isCompact = false,
  initialLimit = 2,
  openMode = false, // Set to true if you want to display the full list immediately
  variant = ""
}) => {
  const [showModal, setShowModal] = useState(false);
  const localization = useSelector((state) => state.localization.localization);

 if (!attributes || attributes.length === 0) {
  return (
    <Text 
      style={{
        textAlign: "center", // Correct property for centering text
        fontSize: 12,
        width: '100%',      // Ensures it takes up the full width to center properly
        marginVertical: 10   // Optional: adds some breathing room
      }}
    >
      No attributes
    </Text>
  );
}

  const displayedAttributes = attributes.slice(0, initialLimit);
  const hasMore = attributes.length > initialLimit;

  const getText = (attr) => {
    const parts = attr.split("{,}");
    return parts[2]?.trim() || parts[1]?.trim() || "";
  };

  // Logic to render the list (used in both normal view and Modal)
  const RenderList = ({ items }) => (
    <View style={{ flexDirection: "column", gap: 8 }}>
      {items.map((attr, index) => {
        const parts = attr.split("{,}");
        return (
          <AttributeItem
            key={index}
            iconID={parts[0]?.trim() || ""}
            fullText={getText(attr)}
            variant={variant}
          />
        );
      })}
    </View>
  );

  // If openMode is active, we just show the full list and skip the modal logic
  if (openMode) {
    return <RenderList items={attributes} />;
  }

  return (
    <View style={{ width: "100%" }}>
      {/* ================== TRIGGER VIEW ================== */}
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => setShowModal(true)}
      >
        {isCompact ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false} // Click opens modal instead of scrolling preview
            contentContainerStyle={{ alignItems: "center", gap: 4 }}
          >
            <RenderList items={displayedAttributes} />
          </ScrollView>
        ) : (
          <RenderList items={displayedAttributes} />
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
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
          >
            <Text style={styles.modalHeader}>
               {localization?.menu?.allAttributes || "All Attributes"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <RenderList items={attributes} />
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>
                {localization?.common?.close || "Close"}
              </Text>
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
    width: "90%",
    maxHeight: "70%",
    backgroundColor: theme.body,
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.text
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: theme.accent,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: theme.body,
    fontWeight: "bold"
  }
});

export default Attributes;