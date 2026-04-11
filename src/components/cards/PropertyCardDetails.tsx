import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import logo from "../../../assets/display/logo.jpeg";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import { Box, VStack } from "../../../components/ui";
import { publicImageURL } from "../../../request";
import DisplayFilesForAssetSchemaActions from "../../Schemas/MenuSchema/DisplayFilesForAssetSchemaActions.json";
import DisplayFilesSchema from "../../Schemas/MenuSchema/DisplayFilesSchema.json";
import { buildFileUrl } from "../../utils/operation/buildFileUrl";
import { isRTL } from "../../utils/operation/isRTL";
import TypeFile from "../form-container/inputs/CustomInputs/TypeFile";
import PolygonMapEmbed from "../maps/DrawSmoothPolygon";
import AccountInfo from "./AccountInfo";
import Attributes from "./Attributes";
import CompanyProjectCard from "./CompanyProjectCards";
import PricePlansSection from "./PricePlansSection";
import AssetActionButton from "./uiComponent/AssetActionButton";

const { width } = Dimensions.get("window");

interface PropertyCardDetailsProps {
  item: any;
  fieldsType: any;
  schemaActions: any;
}

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
  console.log("watch", fieldsType.price, item[fieldsType.price]);
  // 3. Use an effect to set the first item once displayFiles has data
  useEffect(() => {
    if (displayFiles && displayFiles.length > 0 && !selectedImage) {
      setSelectedImage(displayFiles[0]);
    }
  }, [displayFiles]);
  // const ownSchemaWithButtonOnlyParameters = {
  //   ...RequestSchema,
  //   dashboardFormSchemaParameters:
  //     RequestSchema.dashboardFormSchemaParameters.filter(
  //       (pram) => pram.parameterType === "detailsCell",
  //     ),
  // };
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
              areaLocations={[
              {
              [fieldsType.latitude]: item[fieldsType.latitude],
              [fieldsType.longitude]: item[fieldsType.longitude],
            }
            ]}
            locationFields={fieldsType.parameters}
              onLocationChange={() => {}}
              setNewPolygon={() => {}}
              canClickPolygon={false}
              showSuggestsCard={false}
            />
          </View>
        )}

        {/* ========================================== */}
        {/* SECTION 5: PRICE PLANS                     */}
        {/* ========================================== */}
        {/* <View className="w-full items-center justify-center"> */}

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
              <Attributes
                attributes={item[fieldsType.attributes]}
                openMode={true}
              />
            </View>
          )}
        </View>
        <View>
          <PricePlansSection item={item} openingList={true} />
        </View>
      </ScrollView>

      {/* STICKY FOOTER */}
      <View className="flex-row items-center justify-between bg-body py-4 px-4 border-t border-card w-full">
        <AssetActionButton
          isRequested={item?.[fieldsType.isRequested]}
          item={item}
          styleType="scroll"
          additionClassName="w-full"
        />
      </View>
    </Box>
  );
};

export default PropertyCardDetails;
