import { View, Text } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function AssetDetailsAction({
  children,
  itemPackage,
  key,
}: {
  children: any;
  key: any;
  itemPackage: any;
}) {
  const navigation = useNavigation();
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const selected = false;
  const handlePress = () => {
    // if (selectedItems.length > 0) {
    //   handleLongPress();
    // } else {
    navigation.navigate("DetailsProductScreen", {
      id: itemPackage[fieldsType.idField],
      // fieldsType: fieldsType,
      // schemaActions: schemaActions,
    });
    // }
  };
  const handleLongPress = () => {
    if (selected) {
      // setSelectedItems(
      //   selectedItems.filter(
      //     (selectedItem) =>
      //       selectedItem[fieldsType.idField] !== selected[fieldsType.idField],
      //   ),
      // );
    } else {
      // setSelectedItems((prev) => [...prev, itemPackage]);
    }
  };
  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="h-fit"
      key={key}
    >
      {children}
    </Pressable>
  );
}
