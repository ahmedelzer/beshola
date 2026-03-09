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
            ? "rgba(34, 197, 94, 0.1)"
            : addAlpha(theme.accentHover, 0.15),
          borderColor: selected ? "#22c55e" : addAlpha(theme.accentHover, 0.5),
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
              <VStack>
                <View
                  className={
                    isRTL() ? "items-start" : "items-start" + " min-h-28"
                  }
                >
                  {/* Company Name + Verified + Stars */}
                  {fieldsType.companyName && item[fieldsType.companyName] && (
                    <View>
                      {
                        <Image
                          source={
                            item[fieldsType.companyLogo]
                              ? {
                                  uri: GetMediaUrl(
                                    item[fieldsType.companyLogo],
                                    "publicImage",
                                  ),
                                }
                              : "" // Fallback to local asset if URI is null/undefined
                          }
                          // Optional: helps on iOS while the remote image is downloading
                          // defaultSource={defaultImagePath}
                          className="w-10 h-10 rounded-full mr-2"
                          resizeMode="cover"
                        />
                      }
                      <Text
                        numberOfLines={2}
                        key={`${item[fieldsType.idField]}-${
                          fieldsType.companyName
                        }-${item[fieldsType.companyName]}`}
                        className="text-lg font-bold mb-1"
                        style={{ color: theme.secondary, direction: "inherit" }}
                      >
                        {item.verified && (
                          <View className="flex-row items-center">
                            <MaterialCommunityIcons
                              name="check-decagram"
                              size={18}
                              color={theme.accentHover}
                            />
                          </View>
                        )}{" "}
                        {item.companyName}
                      </Text>
                    </View>
                  )}

                  {/* Stars */}
                  {fieldsType.rate && item[fieldsType.rate] && (
                    <View className="flex-row items-center justify-center w-full mb-1">
                      <StarsIcons
                        value={parseFloat(item[fieldsType.rate])}
                        size={14}
                      />
                    </View>
                  )}

                  {/* Property Info */}
                  {fieldsType.attributes && item[fieldsType.attributes] && (
                    <Attributes attributes={item[fieldsType.attributes]} />
                  )}
                </View>
              </VStack>
            </View>
          </View>

          {/* Bottom Actions */}
          <View className="flex-row items-center mt-2 px-2 w-full">
            {/* Address Section - 40% */}
            <View style={{ width: "50%" }} className="pr-1">
              {fieldsType.address && item[fieldsType.address] && (
                /* Pass the address string to your component. 
       The component calculates its own 'glass' width inside this 50% space.
    */
                <AddressComponent addressText={item[fieldsType.address]} />
              )}
            </View>

            {/* Viewers Section - 40% */}
            <View
              style={{ width: "35%" }}
              className="flex-row items-center justify-center px-1"
            >
              <MaterialCommunityIcons
                name="eye-outline"
                size={18}
                color={theme.accent}
              />
              <Text className="text-body text-xs ml-1" numberOfLines={1}>
                {item.viewers} viewing
              </Text>
            </View>

            {/* Chat Section - 20% */}
            <View style={{ width: "10%" }} className="items-end">
              <TouchableOpacity
                className="bg-body p-2 rounded-xl"
                onPress={() => console.log("Contact icon pressed")}
              >
                <AntDesign name="wechat" size={22} color={theme.accent} />
              </TouchableOpacity>
            </View>
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
      <Box className="w-full flex justify-center items-center overflow-hidden rounded-0">
        <ImageCardActions
          fieldsType={fieldsType}
          item={item}
          showFaovertIcon={fieldsType.isFav}
          style={{ width: imageSize, height: imageSize }}
          className={isWeb ? "!w-[100%] !h-40 sm:!h-52 lg:!h-56" : "!size-40"}
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
