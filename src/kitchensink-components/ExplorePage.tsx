import React, { useState } from "react";
import { Pressable, ScrollView, View, Text, Modal, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Box, VStack } from "../../components/ui";
import { useSchemas } from "../../context/SchemaProvider";
import PolygonMapEmbed from "../components/maps/DrawSmoothPolygon";
import SuggestCardContainer from "../components/suggest/SuggestCardContainer";
import AssetsSchemaActions from "../Schemas/MenuSchema/AssetsSchemaActions.json";
import Pro3DViewerModal from "../utils/component/Pro3DViewer";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import HomeCarousel from "./main-content/HomeCarousel.native";
import HomeCarouselWeb from "./main-content/HomeCarousel.web";
import { addAlpha } from "../utils/operation/addAlpha";
import { theme } from "../Theme";
import { Dimensions } from "react-native";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const localization = useSelector((state) => state.localization.localization);

  const [mapModalVisible, setMapModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Box>
          <VStack space="sm">
            {os === "web" ? <HomeCarouselWeb /> : <HomeCarousel />}

            <Pro3DViewerModal />

            {/* <View className="flex-col">
              <SuggestCardContainer
                row={{ onlyDiscountItems: true }}
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.discountItems}
              />
            </View>

            <View className="flex-col">
              <SuggestCardContainer
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.suggestItems}
              />
            </View> */}
          </VStack>
        </Box>
      </ScrollView>

    
      {/* Centered modal */}
      <Modal
        visible={mapModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Pressable
              onPress={() => setMapModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </Pressable>

            <PolygonMapEmbed
              clickable={false}
              onLocationChange={(loc) => console.log(loc)}
              setNewPolygon={(poly) => console.log(poly)}
              style={{ width: "100%", height: 300, borderRadius: 12 }}
              
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: theme.accentHover,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    color: theme.body,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // dark overlay
    justifyContent: "center",         // stick drawer to bottom
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: addAlpha(theme.body, 0.5),
    borderRadius: 24,                   // rounded top corners
    padding: 16,
    width: "100%",
    height: "80%",        // 80% of screen height
    alignItems: "center",
    overflow: "hidden",
  },
  modalCloseButton: {
    backgroundColor: addAlpha(theme.error, 0.5),
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});





export default Explorepage;