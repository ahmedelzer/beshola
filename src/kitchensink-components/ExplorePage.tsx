import React from "react";
import { ScrollView, View } from "react-native";
import { Box, Heading, VStack } from "../../components/ui";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import FaovertMenuItems from "./main-content/FaovertMenuItems";
import HomeCarousel from "./main-content/HomeCarousel.native";
import HomeCarouselWeb from "./main-content/HomeCarousel.web";
import AddressLocationCollapsible from "../utils/component/AddressLocationCollapsible";
import { theme } from "../Theme";
import SuggestCardContainer from "../components/suggest/SuggestCardContainer";
import AssetsSchemaActions from "../Schemas/MenuSchema/AssetsSchemaActions.json";
import { useSchemas } from "../../context/SchemaProvider";
import { useSelector } from "react-redux";
import { PolygonForm } from "../components/maps/PolygonForm";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const { recommendedState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);

  return (
    <>
      <ScrollView>
        <Box>
          <VStack space="sm">
            {os === "web" && <HomeCarouselWeb />}
            {os !== "web" && <HomeCarousel />}
            <PolygonForm enable={false} setNewPolygon={() => {}} />
            <View className="flex-col">
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
            </View>

            {/* <HomeContent /> */}
            <FaovertMenuItems />
          </VStack>
        </Box>
      </ScrollView>
    </>
  );
};

export default Explorepage;
