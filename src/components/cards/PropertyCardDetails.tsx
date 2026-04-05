import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import { Box, HStack, Text, VStack } from "../../../components/ui";
import DisplayFilesForAssetSchemaActions from "../../Schemas/MenuSchema/DisplayFilesForAssetSchemaActions.json";
import { theme } from "../../Theme";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import { isRTL } from "../../utils/operation/isRTL";
import AccountInfo from "./AccountInfo";
import AddressComponent from "./AddressComponent";
import Attributes from "./Attributes";
import PricePlansSection from "./PricePlansSection";
import PropertyCardButtonsActions from "./PropertyCardButtonsActions";
import DisplayFilesServerSchema from "../../Schemas/MenuSchema/DisplayFilesServerSchema.json";
import TypeFile from "../form-container/inputs/CustomInputs/TypeFile";
import { buildFileUrl } from "../../utils/operation/buildFileUrl";
import { publicImageURL } from "../../../request";

const { width } = Dimensions.get("window");

interface PropertyCardDetailsProps {
  item: any;
  fieldsType: any;
  schemaActions: any;
}

const testImages = [
  "https://www.nawy.com/blog/wp-content/uploads/2022/12/%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA-%D9%84%D9%84%D8%A8%D9%8A%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-%D8%B2%D8%A7%D9%8A%D8%AF.png",
  "https://www.ecoprops.co.za/images/slide-1.jpg",
  "https://www.whatsonincannes.com/wp-content/uploads/2017/05/properties2.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTta0XsQDICRBsKhhCivnBCRkL3KDsfAc66jg&s",
];

const PropertyCardDetails: React.FC<PropertyCardDetailsProps> = ({
  item,
  fieldsType,
  schemaActions,
}) => {
  const getAction =
    DisplayFilesForAssetSchemaActions &&
    DisplayFilesForAssetSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );
  const dataSourceAPI = (query) =>
    buildApiUrl(query, {
      pageIndex: 1,
      pageSize: 1000,
      activeStatus: 1,
      projectRout: getAction.projectProxyRoute,
      ...item,
    });
  const fileFieldNameButtonPaging =
    DisplayFilesServerSchema.dashboardFormSchemaParameters.find(
      (field) => field.parameterType === "image",
    )?.parameterField;
  const query = dataSourceAPI(getAction);
  const { data: displayFilesReq } = useFetchWithoutBaseUrl(query);
  const displayFiles = displayFilesReq?.dataSource?.map((row) => ({
    ...row,
    displayFile: buildFileUrl(publicImageURL, row[fileFieldNameButtonPaging]),
    fileCodeNumber: row.fileCodeNumber === 0 ? "image" : "video",
    id: row[DisplayFilesServerSchema.idField],
    status: true,
  }));

  const [selectedImage, setSelectedImage] = useState(displayFiles?.[0]);

  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
  const localization = useSelector(
    (state: any) => state.localization.localization,
  );
  const price = item?.[fieldsType.price];
  const priceAfterDiscount = item?.[fieldsType.priceAfterDiscount];
  const hasDiscount = item?.[fieldsType.discount] > 0;
  console.log("displayFiles", displayFiles);
  return (
    <Box className="flex-1 bg-body">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Gallery */}
        {displayFiles && selectedImage && (
          <View className="relative">
            <Image
              source={{ uri: selectedImage?.displayFile }}
              className="w-full h-64 sm:h-96 lg:h-[400px] my-2"
              resizeMode="cover"
            />
            <View className="absolute top-2 !bg-transparent right-2 flex-row space-x-2">
              <PropertyCardButtonsActions
                item={item}
                fieldsType={fieldsType}
                additionClassName={"!bg-transparent"}
              />
            </View>
          </View>
        )}

        <HStack className="gap-x-4 flex-row gap-y-5 py-3 items-center justify-center flex-wrap">
          {displayFiles &&
            displayFiles?.map((img, idx) => (
              // <TouchableOpacity
              // className={`!w-16 !h-16 rounded-md border-2 ${
              //   selectedImage === img ? "!border-accent" : "border-border"
              // }`}
              //   key={idx}
              //   onPress={() => setSelectedImage(img)}
              // >
              <TypeFile
                file={img.displayFile}
                type={img.fileCodeNumber}
                className={`!w-16 !h-16 rounded-md border-2 ${
                  selectedImage === img ? "!border-accent" : "border-border"
                }`}
                haveFileStatuesFieldName={false}
              />
              // </TouchableOpacity>
            ))}
        </HStack>

        {/* Main Content */}
        <Box className="px-4">
          <VStack>
            <View className={isRTL() ? "items-start" : "items-start min-h-28"}>
              {/* Company Name + Verified */}
              {/* {fieldsType.companyName && item[fieldsType.companyName] && (
        <Text
          numberOfLines={2}
          key={`${item[fieldsType.idField]}-${fieldsType.companyName}-${
            item[fieldsType.companyName]
          }`}
          className="text-lg font-bold mb-1"
          style={{ color: theme.secondary, direction: "inherit" }}
        >
          {item.verified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color={theme.accentHover}
            />
          )}{" "}
          {item.companyName}
        </Text>
      )} */}
              <AccountInfo fieldsType={fieldsType} item={item} />

              {/* attributes */}
              {fieldsType.attributes && item?.[fieldsType.attributes] && (
                <View className="w-full">
                  <Attributes attributes={item[fieldsType.attributes]} />
                </View>
              )}
            </View>
          </VStack>

          {/* Map & Location */}
          {item && (
            <View className="w-full my-4">
              {fieldsType.address && item[fieldsType.address] && (
                <AddressComponent
                  addressText={item[fieldsType.address]}
                  fieldsType={fieldsType}
                  item={item}
                />
              )}
            </View>
          )}

          {/* Currently Viewing + Contact Button */}
          <HStack className="items-center justify-between mb-4">
            <HStack className="items-center gap-x-2">
              <MaterialCommunityIcons
                name="eye-outline"
                size={18}
                color={theme.accent}
              />
              <Text className="text-text text-sm">
                {item?.[fieldsType.onlineAssetViews] || 0}{" "}
                {localization.menu.viewing || "Viewing"}
              </Text>
            </HStack>
            <TouchableOpacity
              className="bg-accent p-2 rounded-full"
              onPress={() => console.log("Contact pressed")}
            >
              <AntDesign name="wechat" size={24} color={theme.body} />
            </TouchableOpacity>
          </HStack>

          {/* Price Plans */}
          {/* <PricePlansSection pricePlans={item.pricePlans} /> */}
          {/* <PricePlansInput pricePlans={item.pricePlans} /> */}
          <PricePlansSection item={item} />
        </Box>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="flex-row items-center justify-between bg-body py-4 px-4 border-t border-card">
        {/* {item[fieldsType.price] && (
          <Text className="text-2xl font-bold text-text">
            {priceAfterDiscount.toFixed(2)} {localization.menu.currency}
          </Text>
        )} */}

        <TouchableOpacity
          className="bg-accent px-4 py-2 rounded-xl flex-row justify-center items-center"
          onPress={() => console.log("Contact icon pressed")}
        >
          <FontAwesome6 name="sack-dollar" size={24} color={theme.body} />
          <Text className="text-md text-body ml-1">Booked</Text>
        </TouchableOpacity>
      </View>
    </Box>
  );
};

export default PropertyCardDetails;
