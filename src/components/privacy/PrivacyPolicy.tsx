import React from "react";
import { View, Text, ScrollView, Linking, Image } from "react-native";
import policies from "./privacyPolicy.json"; // your JSON
import { useSelector } from "react-redux";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";

const PrivacyPolicy = ({ route }) => {
  const { companyName } = route.params || {};
  const localization = useSelector((state) => state.localization.localization);
  const fetch = useFetch(
    "/Language/GetProjectLocalization/ENG_US/BrandingMartE-ShopTerms%26Conditions",
    "BrandingMartLanguage",
  );
  // helper to render links/emails
  const renderTextWithLinks = (text) => {
    const emailRegex = /\S+@\S+\.\S+/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let parts = text.split(/(\S+@\S+\.\S+|https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      if (emailRegex.test(part)) {
        return (
          <Text
            key={index}
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(`mailto:${part}`)}
          >
            {part}
          </Text>
        );
      } else if (urlRegex.test(part)) {
        return (
          <Text
            key={index}
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  return (
    <ScrollView className="bg-gray-100">
      {/* Company name */}
      {companyName && (
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-3xl font-bold mb-4">{companyName}</Text>
        </View>
      )}

      <View className="container mx-auto px-4 py-8">
        {/* loop over all policy sections */}
        {Object.keys(policies).map((key, sectionIndex) => {
          const section = policies[key];

          return (
            <View key={sectionIndex} className="mb-8">
              {/* Section Title */}
              <Text className="text-3xl font-bold mb-4">{section.title}</Text>

              {/* Section Content */}
              {section.content.map((block, index) => {
                if (block.type === "subtitle") {
                  return (
                    <Text key={index} className="text-2xl font-bold mb-2">
                      {block.text}
                    </Text>
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <Text key={index} className="mb-4">
                      {renderTextWithLinks(block.text)}
                    </Text>
                  );
                }
                if (block.type === "list") {
                  return (
                    <View key={index} className="mb-4">
                      {block.items.map((item, i) => (
                        <Text key={i}>• {renderTextWithLinks(item)}</Text>
                      ))}
                    </View>
                  );
                }
                return null;
              })}
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center bg-gray-200 px-4 py-3 mt-4">
        <Image
          source={require("../../../assets/display/logo.webp")}
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
        />
        <Text className="text-center text-md font-semibold">
          {localization.PrivacyPolicy.poweredBy}
        </Text>
        <Image
          source={require("../../../assets/display/IHS-logo.png")}
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
