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
import { Box, HStack, Text, VStack } from "../../../components/ui";
import { theme } from "../../Theme";
import StarsIcons from "../../utils/component/StarsIcons";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import { isRTL } from "../../utils/operation/isRTL";
import LocationMap from "../maps/LocationMap.web";
import PricePlansInput from "./PricePlansInput";
import PropertyCardButtonsActions from "./PropertyCardButtonsActions";

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
  const [selectedImage, setSelectedImage] = useState(testImages[0]);
  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 100 });
  const localization = useSelector(
    (state: any) => state.localization.localization,
  );
  const price = item?.[fieldsType.price];
  const priceAfterDiscount = item?.[fieldsType.priceAfterDiscount];
  const hasDiscount = item?.[fieldsType.discount] > 0;

  return (
    <Box className="flex-1 bg-body">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Gallery */}
        {item[fieldsType.imageView] && (
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
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

        <HStack className="gap-x-4 gap-y-5 py-3 items-center justify-center flex-wrap">
          {testImages.map((img, idx) => (
            <TouchableOpacity key={idx} onPress={() => setSelectedImage(img)}>
              <Image
                source={{ uri: img }}
                className={`w-16 h-16 rounded-md border-2 ${
                  selectedImage === img ? "!border-accent" : "border-gray-300"
                }`}
              />
            </TouchableOpacity>
          ))}
        </HStack>

        {/* Main Content */}
        <Box className="px-4">
          <VStack>
            <View className={isRTL() ? "items-start" : "items-start min-h-28"}>
              {/* Company Name + Verified */}
              {fieldsType.companyName && item[fieldsType.companyName] && (
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
              )}

              {/* Stars */}
              {fieldsType.rate && item[fieldsType.rate] && (
                <View className="flex-row items-center w-full mb-2">
                  <StarsIcons
                    value={parseFloat(item[fieldsType.rate])}
                    size={14}
                  />
                </View>
              )}

              {/* Property Info */}
              <Text className="text-text text-sm mb-2 ps-2">
                {item.propertyType} • {item.bedrooms} Beds • {item.bathrooms}{" "}
                Baths • {item.area} m²
              </Text>
            </View>
          </VStack>

          {/* Map & Location */}
          {item && (
            <View className="w-full my-4">
              {/* <LocationMap
                location={item}
                fields={[
                  {
                    parameterType: "mapLatitudePoint",
                    parameterField: fieldsType.lat,
                  },
                  {
                    parameterType: "mapLongitudePoint",
                    parameterField: fieldsType.lng,
                  },
                ]}
                onLocationChange={() => {}}
                clickable={false}
                haveRadius={false}
              /> */}
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
                {item.viewers || 0} viewing now
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
          <PricePlansInput pricePlans={item.pricePlans} />
        </Box>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="flex-row items-center justify-between bg-body py-4 px-4 border-t border-card">
        {item[fieldsType.price] && (
          <Text className="text-2xl font-bold text-text">
            {priceAfterDiscount.toFixed(2)} {localization.menu.currency}
          </Text>
        )}

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
