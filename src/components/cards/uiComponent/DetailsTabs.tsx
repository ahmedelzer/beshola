import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "../../../Theme";

export default function DetailsTabs({ activeTab, setActiveTab }) {
  return (
    <View className="flex-row px-4 pt-4">
      {/* COMPANY ITEMS TAB */}
      <TouchableOpacity
        onPress={() => setActiveTab("companyItems")}
        className={`flex-1 pb-2 items-center ${
          activeTab === "companyItems"
            ? "!border-accent"
            : "!border-transparent"
        }`}
        style={{
          borderBottomWidth: 3,
          borderBottomColor:
            activeTab === "companyItems" ? theme.accent : "transparent",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: activeTab === "companyItems" ? "bold" : "normal",
            color: theme.text,
          }}
        >
          {"Company Information"}
        </Text>
      </TouchableOpacity>
      {/* DETAILS TAB */}
      <TouchableOpacity
        onPress={() => setActiveTab("details")}
        className={`flex-1 pb-2 items-center ${
          activeTab === "details" ? "!border-accent" : "!border-transparent"
        }`}
        style={{
          borderBottomWidth: 3,
          borderBottomColor:
            activeTab === "details" ? theme.accent : "transparent",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: activeTab === "details" ? "bold" : "normal",
            color: theme.text,
          }}
        >
          {"Details"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
