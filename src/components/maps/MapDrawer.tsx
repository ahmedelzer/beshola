import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import AssetsSchemaActions from '../../Schemas/MenuSchema/AssetsSchemaActions.json'

const MapDrawer = ({ row, onClose }) => {
  return (
    <View className="bg-body rounded-t-3xl h-[80%]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold"></Text>

        <TouchableOpacity onPress={onClose}>
          <Image
            source={{
              uri: "https://www.nawy.com/assets/icons/new/circle-close-icon.svg",
            }}
            className="w-7 h-7"
          />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <SuggestCardContainer
                      row={row}
                      suggestContainerType={0}
                      schemaActions={AssetsSchemaActions}
                      shownNodeMenuItemIDs={[]}
                    />
    </View>
  );
};

export default MapDrawer;
