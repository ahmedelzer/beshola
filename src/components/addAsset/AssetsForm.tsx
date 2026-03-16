import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SearchTabs } from "../company-components/SearchTabs";
import CompanyCardsFlatList from "../company-components/CompanyCardsVirtualized";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import { useSearch } from "../../../context/SearchProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CompanyCardView from "../company-components/CompanyCardView";
import SkeletonMenuCardWeb from "../skeletonLoading/SkeletonMenuCardWeb";
import AddAsset from "./AddAsset";
import OwnAssetCard from "../cards/OwnAssetCard";
const AssetsForm = () => {
  const { menuItemsState } = useSchemas();

  const { handleScroll, state } = useSearch();
  const { rows, skip, totalCount, loading } = state;
  const [selectedItems, setSelectedItems] = useState([]);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const navigation = useNavigation();
  const localization = useSelector((state) => state.localization.localization);

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
