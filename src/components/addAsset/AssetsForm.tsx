import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import OwnAssetCard from "../cards/OwnAssetCard";
import CompanyCardsFlatList from "../company-components/CompanyCardsVirtualized";
import { usePreloadList } from "../Pagination/usePreloadList";
import SkeletonMenuCardWeb from "../skeletonLoading/SkeletonMenuCardWeb";
import AddAssetsSchema from "../../Schemas/MenuSchema/AddAssetsSchema.json";
import AddAssetsSchemaActions from "../../Schemas/MenuSchema/AddAssetsSchemaActions.json";
import AddAsset from "./AddAsset";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { MaterialIcons } from "@expo/vector-icons";
import EmptyMessage from "../../utils/component/EmptyMessage";

const AssetsForm = () => {
  const { menuItemsState } = useSchemas();

  const [selectedItems, setSelectedItems] = useState([]);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const navigation = useNavigation();
  const localization = useSelector((state) => state.localization.localization);

  const { rows, totalCount, loading, handleScroll } = usePreloadList({
    idField: AddAssetsSchema.idField,
    schemaActions: AddAssetsSchemaActions,
    row: {},
    deps: [],
  });
  if (!loading && rows.length === 0) {
    return (
      <EmptyMessage
        message={localization.Hum_screens.ownAsset.noAsset}
        actionComponent={<AddAsset />}
      />
    );
  }
  return (
    <View className="flex-1 bg-background">
      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <CompanyCardsFlatList
          rows={rows}
          fieldsType={fieldsType}
          cartState={{ rows: [] }}
          menuItemsState={menuItemsState}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          CardComponent={OwnAssetCard}
        />

        <RenderLoadingItems
          SkeletonComponent={SkeletonMenuCardWeb}
          loading={loading}
          classNameContainer="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3"
          rows={rows}
        />
      </ScrollView>

      {/* Fixed Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface p-3 rounded-2xl mb-2 shadow-sm border border-outline-20">
        <AddAsset />
      </View>
    </View>
  );
};

export default AssetsForm;
