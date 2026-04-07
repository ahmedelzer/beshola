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

export default function SuggestCard({
  item,
  imageScale = scale(150),
  fieldsType,
  schemaActions,
  variant="small"
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
      <View
  className="w-full p-2 overflow-hidden" // Added overflow-hidden to clip any stray content
  style={{ 
    width: imageScale, 
    backgroundColor :theme.body,
    height: 30, // ✅ Fixed height added here
    justifyContent: 'center' // Centers the attributes vertically within that fixed height
  }}
>
  <Attributes
    attributes={
      item?.[fieldsType?.attributes] || item?.["attributes"] || []
    }
    isCompact={true}
    variant="small"
  />
</View>
      <View style={{ width: imageScale }}>
        <PricePlansSection item={item} variant={variant} />
      </View>
    </View>
  );
}
