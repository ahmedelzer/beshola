// import React, { useState } from "react";
// import {
//   Feather,
//   AntDesign,
//   FontAwesome6,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { Platform, Text, TouchableOpacity, View } from "react-native";
// import { useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import { Card, Box, VStack } from "../../../components/ui";
// import { theme } from "../../Theme";
// import PricePlansSection from "./PricePlansSection";
// import ImageCardActions from "./ImageCardActions";
// import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
// import StarsIcons from "../../utils/component/StarsIcons";
// import { isRTL } from "../../utils/operation/isRTL";
// import PropertyCardButtonsActions from "./PropertyCardButtonsActions";
// import { MemoizedImageCard } from "./CompanyCard";
// import ExpandableText from "../../utils/component/ExpandableText";

// interface RequestCardProps {
//   itemPackage: any;
//   selectedItems?: any[];
//   setSelectedItems?: (items: any[]) => void;
//   schemaActions: any;
// }

// const RequestCard: React.FC<RequestCardProps> = ({
// itemPackage,
// selectedItems = [],
// setSelectedItems,
// schemaActions,
// }) => {
//   const [item] = useState(itemPackage);
//   const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
//   const selected = false;

//   const { control, handleSubmit, formState, setValue, watch } = useForm();
//   const attributesText = item[fieldsType.attributes]
//     ?.map((att) => att.value)
//     .join(" • "); // join with bullet or comma
//   const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
//   const localization = useSelector(
//     (state: any) => state.localization.localization,
//   );
//   const isWeb = Platform.OS === "web";

//   const handlePress = () => {
//     if (selectedItems.length > 0) {
//       // handle selection logic
//     } else {
//       // navigate to details if needed
//     }
//   };

//   return (
//     <View className="mb-3">
//       {/* Top Buttons */}
//       <PropertyCardButtonsActions
//         item={item}
//         fieldsType={fieldsType}
//         widthBorder={true}
//       />

//       {/* Main Card */}
//       {/*
//        */}
//       <Card
//         className={`items-center rounded-xl overflow-hidden border relative ${
//           selected ? "border-2 border-green-500 bg-green-100" : "bg-dark_card"
//         } !rounded-none`}
//       >
//         <View className="w-full flex flex-col">
//           {/* Image + Info Section */}
//           <View
//             style={!isWeb ? { flexDirection: "row", width: "100%" } : undefined}
//             className={isWeb ? "grid grid-cols-2 w-full" : undefined}
//           >
//             {/* Image */}
//             <View
//               style={!isWeb ? { width: "50%" } : undefined}
//               className="w-full flex flex-col relative"
//             >
//               <MemoizedImageCard
//                 item={item}
//                 fieldsType={fieldsType}
//                 imageSize={imageSize}
//                 schemaActions={schemaActions}
//               />
//             </View>

//             {/* Content */}
//             <View
//               style={
//                 !isWeb
//                   ? { width: "50%", justifyContent: "space-between" }
//                   : undefined
//               }
//               className="w-full flex flex-col justify-between ps-2"
//             >
//               <VStack>
//                 <View
//                   className={
//                     isRTL() ? "items-start" : "items-start" + " min-h-28"
//                   }
//                 >
//                   {/* Company Name + Verified + Stars */}
//                   {fieldsType.companyName && item[fieldsType.companyName] && (
//                     <Text
//                       numberOfLines={2}
//                       key={`${item[fieldsType.idField]}-${
//                         fieldsType.companyName
//                       }-${item[fieldsType.companyName]}`}
//                       className="text-lg font-bold mb-1"
//                       style={{ color: theme.secondary, direction: "inherit" }}
//                     >
//                       {item.verified && (
//                         <View className="flex-row items-center">
//                           <MaterialCommunityIcons
//                             name="check-decagram"
//                             size={18}
//                             color={theme.accentHover}
//                           />
//                         </View>
//                       )}{" "}
//                       {item.companyName}
//                     </Text>
//                   )}

//                   {/* Stars */}
//                   {fieldsType.rate && item[fieldsType.rate] && (
//                     <View className="flex-row items-center justify-center w-full mb-1">
//                       <StarsIcons
//                         value={parseFloat(item[fieldsType.rate])}
//                         size={14}
//                       />
//                     </View>
//                   )}

//                   {/* Property Info */}
//                   {fieldsType.attributes && item[fieldsType.attributes] && (
//                     <ExpandableText
//                       text={attributesText}
//                       className="text-body text-sm mb-1 ps-4"
//                     />
//                   )}
//                 </View>
//               </VStack>
//             </View>
//           </View>

//           {/* Bottom Actions */}
//           <View
//             className="flex-row justify-between items-center mt-1 gap-1"
//             style={{ gap: 3 }}
//           >
//             {fieldsType.location && item[fieldsType.location] && (
//               <TouchableOpacity
//                 className="bg-accentHover px-3 py-1 rounded-full shadow flex-row items-center"
//                 onPress={() => console.log("Redirect to map:", item.location)}
//               >
//                 <MaterialCommunityIcons
//                   name="map-marker-outline"
//                   size={18}
//                   color={theme.body}
//                 />
//                 <Text className="text-body text-sm font-semibold ml-1">
//                   {item.location}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity
//               className="bg-accent p-2 rounded-xl flex-1 flex-row justify-center items-center"
//               onPress={() => console.log("Contact icon pressed")}
//             >
//               <FontAwesome6 name="sack-dollar" size={24} color={theme.body} />
//               <Text className="text-md text-body ml-1">Booked</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="bg-body p-2 rounded-xl"
//               onPress={() => console.log("Contact icon pressed")}
//             >
//               <AntDesign name="wechat" size={24} color={theme.accent} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Card>

//       {/* Price Plans */}
//       <PricePlansSection pricePlans={item.pricePlans} />
//     </View>
//   );
// };

// export default RequestCard;

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
import { Card, Box, VStack, HStack } from "../../../components/ui";
import { theme } from "../../Theme";
import PricePlansSection from "./PricePlansSection";
import ImageCardActions from "./ImageCardActions";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import StarsIcons from "../../utils/component/StarsIcons";
import { isRTL } from "../../utils/operation/isRTL";
import PropertyCardButtonsActions from "./PropertyCardButtonsActions";
import ExpandableText from "../../utils/component/ExpandableText";
import RequestSchema from "../../Schemas/MenuSchema/RequestSchema.json";
import Attributes from "../../components/cards/Attributes";
import { ScreenWidth } from "../shared";
import { GetMediaUrl } from "../../utils/operation/GetMediaUrl";
import AddressComponent from "./AddressComponent";
import { addAlpha } from "../../utils/operation/addAlpha";
import { onApply } from "../form-container/OnApply";
import AccountInfo from "./AccountInfo";
import { ButtonInput } from "../form-container";
import { CreateInputProps } from "../form-container/CreateInputProps";
import { GetFieldsItemTypes } from "../../utils/operation/GetFieldsItemTypes";
import StaticButtonInput from "../form-container/inputs/StaticButtonInput";
import RequestSchemaActions from "../../Schemas/MenuSchema/RequsetTimeSchemaActions.json";
import RequsetTimeSchema from "../../Schemas/MenuSchema/RequsetTimeSchema.json";
import RequestActionsButtons from "./uiComponent/RequestActionsButtons";
import AssetDetailsAction from "../company-components/AssetDetailsAction";
import { getUniqueKey } from "../../utils/operation/getUniqueKey";

interface RequestCardProps {
  itemPackage: any;
  selectedItems?: any[];
  setSelectedItems?: (items: any[]) => void;
  schemaActions: any;
}

const RequestCard: React.FC<RequestCardProps> = ({
  itemPackage,
  selectedItems = [],
  setSelectedItems,
  schemaActions,
}) => {
  const [item] = useState(itemPackage);
  const fieldsType = GetFieldsItemTypes(RequestSchema);
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
  const ownSchemaWithButtonOnlyParameters = {
    ...RequestSchema,
    dashboardFormSchemaParameters:
      RequestSchema.dashboardFormSchemaParameters.filter(
        (pram) => pram.parameterType === "detailsCell",
      ),
  };
  const isWeb = Platform.OS === "web";
  return (
    <AssetDetailsAction
      itemPackage={item}
      key={getUniqueKey(
        itemPackage[fieldsType.idField],
        fieldsType.attributes,
        JSON.stringify(itemPackage),
      )}
    >
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
            borderColor: selected
              ? theme.accentHover
              : addAlpha(theme.body, 0.5),
          }}
        >
          <View className="w-full flex flex-col">
            {/* Image + Info Section */}
            <View
              style={
                !isWeb ? { flexDirection: "row", width: "100%" } : undefined
              }
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
              <RequestActionsButtons
                key={getUniqueKey(
                  item[fieldsType.idField],
                  fieldsType.isRequested,
                  item[fieldsType.isRequested],
                )}
                item={item}
                styleType="scroll"
              />
            </View>
          </View>
        </Card>

        {/* Price Plans */}
        <PricePlansSection item={item} />
      </View>
    </AssetDetailsAction>
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
          style={{ width: imageSize, height: imageSize }}
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

export default RequestCard;
