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
import Attributes from "./Attributes";
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

const OwnAssetCard: React.FC<CompanyCardProps> = ({
  itemPackage,
  selectedItems = [],
  setSelectedItems,
  schemaActions,
}) => {
  const [item] = useState(itemPackage);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const selected = false;

  const { control, handleSubmit, formState, setValue, watch } = useForm();

  const imageSize = getResponsiveImageSize(0.2, { min: 30, max: 80 });
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
      {/* Main Card */}
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
        <View className="flex-row items-center mt-2 px-2 w-full">
          <View className="flex flex-col relative w-1/4">
            <MemoizedImageCard
              item={item}
              fieldsType={fieldsType}
              imageSize={imageSize}
              schemaActions={schemaActions}
            />
          </View>
          <View className="flex-col justify-evenly items-center w-1/2">
            {/* Address Section - 50% width */}
            <View
              style={{ width: "50%" }}
              className="items-center justify-center"
            >
              {fieldsType.address && item[fieldsType.address] && (
                <AddressComponent
                  addressText={item[fieldsType.address]}
                  fieldsType={fieldsType}
                  item={item}
                />
              )}
            </View>
          </View>
          <View className="flex-col justify-evenly items-center w-1/4">
            {/* Chat Section - 15% width */}
            <View
              style={{ width: "15%" }}
              className="items-center justify-center"
            >
              <TouchableOpacity
                className="p-2 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.accent }}
                onPress={() => console.log("Contact icon pressed")}
              >
                <AntDesign name="form" size={22} color={theme.body} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
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
          className={isWeb ? "!w-[30%] !h-20 sm:!h-32 lg:!h-46" : "!size-20"}
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

export default OwnAssetCard;
