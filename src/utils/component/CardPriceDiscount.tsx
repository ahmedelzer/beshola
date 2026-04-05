import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { theme } from "../../Theme";

export default function CardPriceDiscount({
  item,
  fieldsType,
  colorOfPriceAfterDiscount = theme.body,
  style,
  priceScale
}) {
  const localization = useSelector((state) => state.localization.localization);

  const price = item?.[fieldsType.totalPrice.parameterField];
  const downPayment = item?.[fieldsType.downPayment.parameterField];
  const hasDiscount = item?.[fieldsType.discount.parameterField] > 0;
  const currencyShortName = item?.[fieldsType.currencyShortName.parameterField];
  const priceAfterDiscount =
    price - (price * item?.[fieldsType.discount.parameterField]) / 100;

  // Compose final style
  const finalStyle = [
    styles.discountedPrice,
    { color: colorOfPriceAfterDiscount },
    style,
  ];

  return (
    <View>
      <View style={styles.container}>
        {priceAfterDiscount >= 0 && (
          <Text style={finalStyle}>
            {priceAfterDiscount.toFixed(2)} {currencyShortName}
          </Text>
        )}
        {hasDiscount && (
          <Text style={styles.originalPrice}>
            {price.toFixed(2)} {currencyShortName}
          </Text>
        )}
      </View>
      {downPayment > 0 && (
        <Text style={styles.downPayment}>
         {localization.menu.downPayment||"Down Payment"} {downPayment.toFixed(2)} {currencyShortName}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8, // spacing between prices when discount exists
    textAlign: "center",
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.error,
    textDecorationLine: "line-through",
    textAlign: "center",
  },
  downPayment: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.accentHover,
    textAlign: "center",
  },
});
