import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, HStack, VStack } from "../../../components/ui";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import StarsIcons from "../../utils/component/StarsIcons";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";

const CompanyInfo = ({ item, fieldsType }) => {
  const companyName = item[fieldsType.companyName] || "Company";
  const rate = item[fieldsType.rate] || 0;
  const reviews = item.reviews || 0;
  const location = item.location || "N/A";
  const phone = item.phone || "N/A";
  const properties = item.properties || 0;

  return (
    <View className="px-5 py-4 items-start">
      {/* Rating */}
      <HStack className="items-center mb-3">
        {/* <StarsIcons value={parseFloat(rate)} size={16} />
        <Text className="text-body ml-2">{rate} / 5</Text> */}
        <Text className="text-text ml-1">({reviews} reviews)</Text>
      </HStack>

      {/* Location */}
      <HStack className="items-start mb-3">
        <MaterialCommunityIcons
          name="map-marker"
          size={20}
          color={theme.accent}
        />
        <Text className="text-body ml-2">{location}</Text>
      </HStack>

      {/* Contact */}
      <HStack className="items-start mb-3">
        <Feather name="phone" size={18} color={theme.accent} />
        <Text className="text-body ml-2">{phone}</Text>
      </HStack>

      {/* Properties Count */}
      <HStack className="items-start mb-3">
        <MaterialCommunityIcons
          name="office-building"
          size={20}
          color={theme.accent}
        />
        <Text className="text-body ml-2">{properties} properties listed</Text>
      </HStack>

      {/* Contact Button */}
      <TouchableOpacity
        className="mt-4 bg-accent py-3 rounded-xl items-center justify-center"
        onPress={() => console.log("Contact pressed")}
      >
        <Text className="text-white font-semibold text-base">
          Contact Company
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyInfo;
