import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { useAuth } from "../../../context/auth";
import { MemoizedImageCard } from "./CompanyCard";
import Attributes from "./Attributes"; // ✅ ADD THIS
import PricePlanSummary from "../../kitchensink-components/cart/InvoiceSummary";
import PricePlansSection from "./PricePlansSection";
import { addAlpha } from "../../utils/operation/addAlpha";
import { theme } from "../../Theme";
import { ScrollView } from "react-native";

export default function SuggestCard({
  item,
  imageScale = scale(150),
  fieldsType,
  schemaActions,
  variant = "small",
}) {
  const { userGust } = useAuth();

  return (
    <View className="rounded-lg overflow-hidden">
      {/* Card */}
      <View className="relative">
        <MemoizedImageCard
          item={item}
          fieldsType={fieldsType}
          imageSize={imageScale}
          schemaActions={schemaActions}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center", // vertical centering
        }}
        style={{
          width: imageScale,
          height: 30,
          backgroundColor: theme.body,
        }}
      >
        <Attributes
          attributes={
            item?.[fieldsType?.attributes] || item?.["attributes"] || []
          }
          isCompact={true}
          variant="small"
        />
      </ScrollView>
      <View style={{ width: imageScale }}>
        <PricePlansSection item={item} variant={variant} />
      </View>
    </View>
  );
}
