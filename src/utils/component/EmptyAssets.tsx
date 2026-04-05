import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../Theme";

const EmptyAssets = ({
  message = "You did not add any assets yet",
  IconComponent = (
    <MaterialIcons name={"inventory-2"} size={64} color={theme.text} />
  ),
  actionComponent, // ✅ injected button/component
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 12,
      }}
    >
      {IconComponent}

      <Text
        style={{
          fontSize: 16,
          color: theme.text,
          textAlign: "center",
        }}
      >
        {message}
      </Text>

      {/* ✅ Render button if passed */}
      {actionComponent && (
        <View style={{ marginTop: 12 }}>{actionComponent}</View>
      )}
    </View>
  );
};

export default EmptyAssets;
