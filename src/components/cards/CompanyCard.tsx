import React, { useState } from "react";
import {
  Feather,
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Card, Box, VStack } from "../../../components/ui";
import { theme } from "../../Theme";
import PricePlansSection from "./PricePlansSection";
import ImageCardActions from "./ImageCardActions";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import StarsIcons from "../../utils/component/StarsIcons";
import { isRTL } from "../../utils/operation/isRTL";
import PropertyCardButtonsActions from "./PropertyCardButtonsActions";
import ExpandableText from "../../utils/component/ExpandableText";
import Attributes from "../../components/cards/Attributes";
import { ScreenWidth } from "../shared";
import { GetMediaUrl } from "../../utils/operation/GetMediaUrl";
import AddressComponent from "./AddressComponent";
import { addAlpha } from "../../utils/operation/addAlpha";
import { onApply } from "../form-container/OnApply";
import AccountInfo from "./AccountInfo";
import AddReqButton from "./uiComponent/AddReqButton";
import AssetActionButton from "./uiComponent/AssetActionButton";
import { getUniqueKey } from "../../utils/operation/getUniqueKey";

interface CompanyCardProps {
  itemPackage: any;
  selectedItems?: any[];
  setSelectedItems?: (items: any[]) => void;
  schemaActions: any;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  itemPackage,
  selectedItems = [],
  setSelectedItems,
  schemaActions,
}) => {
  const [item] = useState(itemPackage);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const selected = false;

  const { control, handleSubmit, formState, setValue, watch } = useForm();

  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
  const localization = useSelector(
    (state: any) => state.localization.localization,
  );

  const handlePress = () => {
    if (selectedItems.length > 0) {
      // handle selection logic
    } else {
      // navigate to details if needed
    }
  };
  const defaultImage = require("../../../assets/display/adaptive-icon.png");
  const isWeb = Platform.OS === "web";
  return (
    <View className="mb-3">
      {/* Top Buttons */}
      <PropertyCardButtonsActions
        item={item}
        fieldsType={fieldsType}
        widthBorder={true}
      />

      {/* Main Card */}
      {/*
       */}
      <Card
        className={`items-center rounded-xl overflow-hidden border relative ${
          selected ? "border-2 border-green-500" : ""
        } !rounded-none`}
        style={{
          // Using your theme accent with 30% opacity as requested
          backgroundColor: selected
            ? theme.accentHover
            : addAlpha(theme.body, 0.15),
          borderColor: selected ? theme.accentHover : addAlpha(theme.body, 0.5),
        }}
      >
        <View className="w-full flex flex-col">
          {/* Image + Info Section */}
          <View
            style={!isWeb ? { flexDirection: "row", width: "100%" } : undefined}
            className={isWeb ? "grid grid-cols-2 w-full" : undefined}
          >
            {/* Image */}
            <View
              style={!isWeb ? { width: "50%" } : undefined}
              className="w-full flex flex-col relative"
            >
              <MemoizedImageCard
                item={item}
                fieldsType={fieldsType}
                imageSize={imageSize}
                schemaActions={schemaActions}
              />
            </View>

            {/* Content */}
            <View
              style={
                !isWeb
                  ? { width: "50%", justifyContent: "space-between" }
                  : undefined
              }
              className="w-full flex flex-col justify-between ps-2"
            >
              <VStack className="space-y-2 w-full">
                {/* Row 1: Account Info */}
                <AccountInfo fieldsType={fieldsType} item={item} />
                {/* Row 2: Attributes (full width) */}
                {fieldsType.attributes && item[fieldsType.attributes] && (
                  <View
                    className="w-full"
                    key={getUniqueKey(
                      item[fieldsType.idField],
                      fieldsType.attributes,
                      item[fieldsType.attributes],
                    )}
                  >
                    <Attributes attributes={item[fieldsType.attributes]} />
                  </View>
                )}
              </VStack>
            </View>
          </View>

          {/* Bottom Actions */}
          <View className="flex-row items-center mt-2 px-2 w-full">
            {/* Address Section - 50% width */}
            {fieldsType.address && item[fieldsType.address] && (
              <View
                style={{ width: "50%" }}
                className="items-center justify-center"
                key={getUniqueKey(
                  item[fieldsType.idField],
                  fieldsType.address,
                  item[fieldsType.address],
                )}
              >
                <AddressComponent
                  addressText={item[fieldsType.address]}
                  fieldsType={fieldsType}
                  item={item}
                />
              </View>
            )}
            {/* Viewers Section - 35% width */}
            <View
              style={{ width: "35%" }}
              className="flex-row items-center justify-center px-2 py-1 rounded"
            >
              {fieldsType.onlineAssetViews && (
                <View
                  className="flex-row items-center justify-center px-2 py-1 border rounded"
                  style={{ backgroundColor: addAlpha(theme.body, 0.1) }}
                  key={getUniqueKey(
                    item[fieldsType.idField],
                    fieldsType.onlineAssetViews,
                    item[fieldsType.onlineAssetViews],
                  )}
                >
                  <MaterialCommunityIcons
                    name="eye-outline"
                    size={18}
                    color={theme.accent}
                  />
                  <Text
                    className="text-text text-xs ml-1"
                    key={` ${item[fieldsType.idField]}-
                        ${fieldsType.onlineAssetViews}-
                        ${item[fieldsType.onlineAssetViews]}`}
                  >
                    {item[fieldsType.onlineAssetViews] || 0}{" "}
                    {localization.menu.viewing || "Viewing"}
                  </Text>
                </View>
              )}
            </View>
            {/* Chat Section - 15% width */}
            {/* {fieldsType.isRequested&&( */}
            <View
              style={{ width: "15%" }}
              className="items-center justify-center"
              key={getUniqueKey(
                item[fieldsType.idField],
                fieldsType.isRequested,
                item[fieldsType.isRequested],
              )}
            >
              <AssetActionButton
                isRequested={item?.[fieldsType.isRequested]}
                item={item}
              />
            </View>
            ,{/* )} */}
          </View>
        </View>
      </Card>

      {/* Price Plans */}
      <PricePlansSection item={item} />
    </View>
  );
};

export const MemoizedImageCard = React.memo(
  ({ item, fieldsType, imageSize, schemaActions }: any) => {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === "web";

    const imageHeight = width < 640 ? 160 : width < 1024 ? 208 : 224;
    return (
      <Box
        className="w-full flex justify-center items-center overflow-hidden rounded-0"
        key={getUniqueKey(
          item[fieldsType.idField],
          fieldsType.imageView,
          item[fieldsType.imageView],
        )}
      >
        <ImageCardActions
          fieldsType={fieldsType}
          item={item}
          showFaovertIcon={fieldsType.isFav}
          style={{ width: imageSize, height: imageSize, borderRadius: 0 }}
          //className={isWeb ? "!w-[100%] !h-40 sm:!h-52 lg:!h-56" : "!size-40"}
        >
          <></>
        </ImageCardActions>
      </Box>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item &&
    prevProps.fieldsType === nextProps.fieldsType &&
    prevProps.imageSize === nextProps.imageSize,
);

export default CompanyCard;
