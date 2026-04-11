import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../Theme";

export default function CardPriceDiscount({
  item,
  fieldsType,
  colorOfPriceAfterDiscount = theme.body,
  style,
  boxWidth,
  variant = "", // Added variant to bypass width logic
}) {
  const localization = useSelector((state) => state.localization.localization);

  // Safely extract parameters
  const price = item?.[fieldsType?.totalPrice?.parameterField] || 0;
  const downPayment = item?.[fieldsType?.downPayment?.parameterField] || 0;
  const discountPercent = item?.[fieldsType?.discount?.parameterField] || 0;
  const hasDiscount = discountPercent > 0;
  const currencyShortName =
    item?.[fieldsType?.currencyShortName?.parameterField] || "";

  const priceAfterDiscount = price - (price * discountPercent) / 100;

  // Determine if we should use small styling
  const isSmall = variant === "small";

  return (
    <View style={style}>
      {/* Row 1: Prices */}
      <View style={[styles.container, { marginTop: isSmall ? 0 : 4 }]}>
        {priceAfterDiscount >= 0 && (
          <Text
            numberOfLines={1}
            style={[
              styles.discountedPrice,
              {
                color: colorOfPriceAfterDiscount,
                fontSize: isSmall ? 8 : 16,
              },
            ]}
          >
            {priceAfterDiscount.toFixed(2)} {currencyShortName}
          </Text>
        )}

        {hasDiscount && (
          <Text
            numberOfLines={1}
            style={[styles.originalPrice, { fontSize: isSmall ? 6 : 14 }]}
          >
            {price.toFixed(2)} {currencyShortName}
          </Text>
        )}
      </View>

      {/* Row 2: Down Payment */}
      {downPayment > 0 && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.downPayment, { fontSize: isSmall ? 5 : 10 }]}
        >
          {localization.menu.downPayment || "Down Payment"}:{" "}
          {downPayment.toFixed(2)} {currencyShortName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start", // Changed from center to align with text above
    alignItems: "center",
  },
  discountedPrice: {
    fontWeight: "bold",
    marginRight: 4,
    textAlign: "center",
  },
  originalPrice: {
    fontWeight: "bold",
    color: theme.error,
    textDecorationLine: "line-through",
    textAlign: "center",
    opacity: 0.8,
  },
  downPayment: {
    fontWeight: "bold",
    color: theme.accentHover,
    textAlign: "center",
    marginTop: 1,
  },
});
