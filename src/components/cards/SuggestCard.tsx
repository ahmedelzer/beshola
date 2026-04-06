import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { useAuth } from "../../../context/auth";
import { MemoizedImageCard } from "./CompanyCard";
import Attributes from "./Attributes"; // ✅ ADD THIS
import PricePlanSummary from "../../kitchensink-components/cart/InvoiceSummary";
import PricePlansSection from "./PricePlansSection";

export default function SuggestCard({
  item,
  imageScale = scale(120),
  fieldsType,
  schemaActions,
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

        {/* Attributes */}
        <View
          className="absolute bottom-1 w-full p-2"
          style={{ width: imageScale }}
        >
          <Attributes
            attributes={
              item?.[fieldsType?.attributes] || item?.["attributes"] || []
            }
            isCompact={true} // ✅ FIXED
          />
        </View>
      </View>
      <View style={{ width: imageScale }}>
        <PricePlansSection item={item} priceScale={imageScale} />
      </View>
    </View>
  );
}
