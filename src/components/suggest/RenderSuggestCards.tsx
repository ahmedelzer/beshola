import { default as React } from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { theme } from "../../Theme";
import SuggestCard from "../cards/SuggestCard";
// import { LocalizationContext } from "../../../context/LocalizationContext";
import { useCart } from "../../../context/CartProvider";
import SuggestCardSchema from "../../Schemas/MenuSchema/SuggestCardSchema.json";
import { getItemPackage } from "../company-components/getItemPackage";
import AssetDetailsAction from "../company-components/AssetDetailsAction";
import { getUniqueKey } from "../../utils/operation/getUniqueKey";
export function RenderSuggestCards({
  suggestContainerType,
  items,
  schemaActions,
  suggestFieldsType,
  imageScale = scale(150),
  variant = "small",
}) {
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );
  };

  const chunkedItems = chunkArray(items, 4);

  switch (suggestContainerType) {
    case 0:
      return (
        <>
          {items.map((item) => (
            <AssetDetailsAction
              itemPackage={item}
              key={getUniqueKey(
                item[suggestFieldsType.idField],
                suggestFieldsType.attributes,
                JSON.stringify(item),
              )}
            >
              <SuggestCard
                key={item[suggestFieldsType.idField]}
                schemaActions={schemaActions}
                fieldsType={suggestFieldsType}
                item={item}
                imageScale={imageScale} // ✅ Add this
                variant={variant}
              />
            </AssetDetailsAction>
          ))}
        </>
      );

    case 1:
      return (
        <>
          {chunkedItems.map((group, groupIndex) => (
            <View
              key={`group-${groupIndex}`}
              style={{
                width: scale(200),
                height: "auto",
                backgroundColor: theme.body,
                borderRadius: scale(8),
                padding: scale(8),
                marginRight:
                  groupIndex < chunkedItems.length - 1 ? scale(8) : 0,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignContent: "flex-start",
              }}
              className="overflow-scroll sm:overflow-hidden"
            >
              {group.map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: "48%",
                    height: "50%",
                    marginBottom: scale(80),
                  }}
                >
                  <SuggestCard
                    item={item}
                    fieldsType={suggestFieldsType}
                    schemaActions={schemaActions}
                    imageScale={imageScale}
                    variant={variant} // ✅ Make sure it is here too
                  />
                </View>
              ))}
            </View>
          ))}
        </>
      );

    default:
      return null;
  }
}
