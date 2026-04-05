import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Box, HStack } from "../../../components/ui";
import { useDeviceInfo } from "../../utils/component/useDeviceInfo";
import Searchbar from "../search-bar/Searchbar";
import MenuCardsView from "./CompanyCardsView";
import { MenuTabs } from "./SearchTabs";
import SearchBarFilter from "../filters/SearchBarFilter";
import CompanyCardsView from "./CompanyCardsView";
import { TouchableOpacity } from "react-native";
import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Text } from "react-native";
import { theme } from "../../Theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import PolygonMapEmbed from "../maps/DrawSmoothPolygon";

const SearchView = ({}: any) => {
  const { width, height, os, modelName } = useDeviceInfo();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const route = useRoute();

  const view = route.params?.view;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setKey((r) => r + 1);
    // Do your refresh logic here, e.g., reset row or re-fetch data
    // Simulate API delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const Content = (
    <>
      <HStack space="sm" className="items-center md:my-1 !bg-body py-3 z-50">
        {/* Optional filters */}
        <View style={{ minWidth: 50 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Search", {
                view: view === "map" ? "list" : "map",
              });
            }}
            className="p-2 w-full rounded-xl flex-row gap-1 items-center justify-center"
            style={{
              backgroundColor: view === "map" ? theme.accent : theme.text,
            }}
          >
            {/* Icon */}
            <FontAwesome6 name="earth-africa" size={24} color={theme.body} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Searchbar />
        </View>

        <View style={{ flex: 0, minWidth: 50 }}>
          <SearchBarFilter />
        </View>
      </HStack>

      <Box
        className="md:px-0 -mt-4"
        style={{ paddingBottom: os === "web" ? 0 : 180 }}
        key={key}
      >
        <CompanyCardsView isRefreshed={key} />
      </Box>
    </>
  );

  return os === "web" ? (
    <>{Content}</>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Content}
    </ScrollView>
  );
};

export default SearchView;
