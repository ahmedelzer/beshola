import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import DisplayFilesSchema from "../../Schemas/MenuSchema/DisplayFilesSchema.json";
import TypeFile from "../form-container/inputs/CustomInputs/TypeFile";
import { buildFileUrl } from "../../utils/operation/buildFileUrl";
import { publicImageURL } from "../../../request";
import logo from "../../../assets/display/logo.jpeg";
import PolygonMapEmbed from "../maps/DrawSmoothPolygon";
import AssetsSchemaActions from "../../Schemas/MenuSchema/AssetsSchemaActions.json";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import { useTab } from "../../../context/TabsProvider";
import CompanyProjectCard from "./CompanyProjectCards";

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
  const { activeTab } = useTab();

  const dataSourceAPI = (query) =>
    buildApiUrl(query, {
      pageIndex: 1,
      pageSize: 1000,
      activeStatus: 1,
      projectRout: getAction.projectProxyRoute,
      ...item,
    });
  const fileFieldNameButtonPaging =
    DisplayFilesSchema.dashboardFormSchemaParameters.find(
      (field) => field.parameterType === "image",
    )?.parameterField;
  const query = dataSourceAPI(getAction);
  const { data: displayFilesReq } = useFetchWithoutBaseUrl(query);
  const displayFiles = displayFilesReq?.dataSource?.map((row) => ({
    ...row,
    displayFile: buildFileUrl(publicImageURL, row[fileFieldNameButtonPaging]),
    fileCodeNumber: row.fileCodeNumber === 0 ? "image" : "video",
    id: row[DisplayFilesSchema.idField],
    status: true,
  }));

  const [selectedImage, setSelectedImage] = useState(null);

  // 3. Use an effect to set the first item once displayFiles has data
  useEffect(() => {
    if (displayFiles && displayFiles.length > 0 && !selectedImage) {
      setSelectedImage(displayFiles[0]);
    }
  }, [displayFiles]);

  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
  const localization = useSelector(
    (state: any) => state.localization.localization,
  );
  const price = item?.[fieldsType.price];
  const priceAfterDiscount = item?.[fieldsType.priceAfterDiscount];
  const hasDiscount = item?.[fieldsType.discount] > 0;
  console.log("====================================");
  console.log(item, "activeTab item");
  console.log("====================================");
  return (
    <Box className="flex-1 bg-body">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ========================================== */}
        {/* SECTION 2: IMAGE GALLERY (Main + Thumbs)   */}
        {/* ========================================== */}
        <Box className="mb-4">
          {/* Selected Main Image */}
          <View className="w-full h-64 sm:h-96 lg:h-[400px] bg-body rounded-lg overflow-hidden items-center justify-center">
            {displayFiles && selectedImage ? (
              <TypeFile
                file={selectedImage.displayFile}
                type={selectedImage.fileCodeNumber}
                className="w-full h-full" // Increased height for main view
                haveFileStatuesFieldName={false}
              />
            ) : (
              <Image
                source={logo}
                className="w-full h-full my-2"
                resizeMode="cover"
              />
            )}
          </View>

          {/* Horizontal Thumbnail Scroller */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
            className="flex-row"
          >
            {displayFiles?.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  console.log("Parent Pressed!");
                  setSelectedImage(img);
                }}
                className={`h-16 w-16 mr-3 rounded-md border-2 overflow-hidden ${
                  selectedImage === img ? "border-accent" : "border-border"
                }`}
              >
                <View pointerEvents="none" className="h-full w-full">
                  <TypeFile
                    file={img.displayFile}
                    type={img.fileCodeNumber}
                    className="h-full w-full"
                    haveFileStatuesFieldName={false}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>

        {/* ========================================== */}
        {/* SECTION 3: CONTENT INFO (Commented Out)    */}
        {/* ========================================== */}
        <Box className="px-4">
          <VStack>
            <View className={isRTL() ? "items-start" : "items-start min-h-28"}>
              <AccountInfo fieldsType={fieldsType} item={item} />
            </View>

            <View className="w-full p-1 rounded-xl">
              <CompanyProjectCard item={item} />
            </View>
          </VStack>
        </Box>

        {/* ========================================== */}
        {/* SECTION 4: MAP & LOCATION (Commented Out)  */}
        {/* ========================================== */}
        {fieldsType.address && item[fieldsType.address] && (
          <View className="w-full mb-4" style={{ height: 400 }}>
            <PolygonMapEmbed
              location={{
                [fieldsType.latitude]: item[fieldsType.latitude],
                [fieldsType.longitude]: item[fieldsType.longitude],
              }}
              fields={fieldsType.parameters}
              onLocationChange={() => {}}
              setNewPolygon={() => {}}
              canClickPolygon={false}
            />
          </View>
        )}

        {/* ========================================== */}
        {/* SECTION 5: PRICE PLANS                     */}
        {/* ========================================== */}
        {/* <View className="w-full items-center justify-center"> */}
        {fieldsType.price && item[fieldsType.price] && (
          <PricePlansSection item={item} openingList={true} />
        )}
        {/* </View> */}
        <View
          className={
            isRTL()
              ? "items-start"
              : "items-start min-h-28" + " border-t pt-1 w-full"
          }
        >
          {fieldsType.attributes && item?.[fieldsType.attributes] && (
            <View className="w-full">
              <Attributes attributes={item[fieldsType.attributes]} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* STICKY FOOTER */}
      <View className="flex-row items-center justify-between bg-body py-4 px-4 border-t border-card">
        <TouchableOpacity
          className="bg-accent px-4 py-3 rounded-xl flex-1 flex-row justify-center items-center"
          onPress={() => console.log("Booked pressed")}
        >
          <FontAwesome6 name="sack-dollar" size={20} color={theme.body} />
          <Text className="text-md font-bold text-body ml-2">Book Now</Text>
        </TouchableOpacity>
      </View>
    </Box>
  );
};

export default PropertyCardDetails;
