import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

const PropertyCard = () => {
  return (
    <View className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden">
      {/* Image Section */}
      <View className="relative">
        <Image
          source={{ uri: "https://via.placeholder.com/400x200" }}
          className="w-full h-48"
        />
        <View className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-full">
          <Text className="text-white text-xs">Mostakbal City, Egypt</Text>
        </View>

        {/* Top Right Buttons */}
        <View className="absolute top-2 right-2 flex-row space-x-2">
          <TouchableOpacity className="bg-white p-2 rounded-full shadow">
            <Text className="text-xs font-semibold">Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 rounded-full shadow">
            <Feather name="share-2" size={16} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 rounded-full shadow">
            <Feather name="heart" size={16} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-2">East Vale</Text>

        <View className="flex-row flex-wrap mb-3">
          {["Apartment", "Townhouse", "Twinhouse", "Villa"].map(
            (item, index) => (
              <Text key={index} className="text-blue-600 text-sm mr-2">
                {item}
              </Text>
            ),
          )}
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-500 text-xs">Developer start price</Text>
            <Text className="text-lg font-semibold text-gray-900">
              EGP 8,500,000
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Resale start price</Text>
            <Text className="text-gray-400 text-sm">No Units</Text>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-2">
            <Text className="text-gray-700 font-semibold">Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-green-500 rounded-xl px-4 py-2">
            <FontAwesome name="whatsapp" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Whatsapp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PropertyCard;
