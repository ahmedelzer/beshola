import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { theme } from "../../Theme";

export default function SchemaTabs({
  params,
  activeTab,
  setActiveTab,
  fieldsType,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {params.map((param, index) => (
        <Pressable
          key={param[fieldsType.id]}
          onPress={() => setActiveTab(index)}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomWidth: activeTab === index ? 3 : 0,
            borderBottomColor: theme.accentHover,
          }}
        >
          <Text
            style={{
              color: activeTab === index ? theme.accentHover : theme.text,
              fontWeight: activeTab === index ? "bold" : "normal",
            }}
          >
            {param[fieldsType.title]}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
