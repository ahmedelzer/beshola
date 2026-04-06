import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import {
  Box,
  Button,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
} from "../../../components/ui";
import PricePlanSchema from "../../Schemas/MenuSchema/PricePlanSchema.json";
import PricePlanSchemaActions from "../../Schemas/MenuSchema/PricePlanSchemaActions.json";
import { theme } from "../../Theme";
import CardPriceDiscount from "../../utils/component/CardPriceDiscount";
import { getField } from "../../utils/operation/getField";
import { isRTL } from "../../utils/operation/isRTL";
import PricePlansInput from "./PricePlansInput";
import { scale } from "react-native-size-matters";
import EmptyAssets from "../../utils/component/EmptyAssets";

const PricePlansSection = ({ item, openingList = false }) => {
  const localization = useSelector((state) => state.localization.localization);
  const [openModal, setOpenModal] = useState(openingList);
  const getAction = PricePlanSchemaActions?.find(
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

  const query = dataSourceAPI(getAction);
  const { data: pricePlans, isLoading } = useFetchWithoutBaseUrl(
    openModal ? query : null,
  );
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });
  const parameters = PricePlanSchema.dashboardFormSchemaParameters;

  const pricePlanFieldsType = {
    idField: PricePlanSchema.idField,
    name: getField(parameters, "onlineAssetPricePlanName", false),
    currencyShortName: getField(parameters, "currencyTypeShortName", false),

    startDate: getField(parameters, "startTime", false),
    endDate: getField(parameters, "endTime", false),

    totalPrice: getField(parameters, "totalPrice", false),
    downPayment: getField(parameters, "downPayment", false),
    discount: getField(parameters, "discountPercentage", false),
    cashback: getField(parameters, "cashbackAmount", false),

    maintenanceFees: getField(parameters, "maintenanceFees", false),
    insuranceFees: getField(parameters, "insuranceFees", false),
    tax: getField(parameters, "taxPercentage", false),

    remarks: getField(parameters, "remarks", false),
  };
  // const selectedPlanIndex = watch("selectedPlan");
  // const selectedPlan = {};
  // const handleOpenMap = (location) => {
  //   const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  //     location,
  //   )}`;
  //   Linking.openURL(url);
  // };
  const [boxWidth, setBoxWidth] = useState(0);
  function RenderPricePlans() {
    if (openingList)
      return (
        <VStack className="space-y-3 w-full">
          <PricePlansInput
            pricePlans={pricePlans?.dataSource || []}
            fieldsType={pricePlanFieldsType}
          />
        </VStack>
      );
    return (
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ModalBackdrop />
        <ModalContent className="rounded-2xl relative bg-body p-3 max-h-[80vh]">
          {/* ...rest of your modal content */}
          <ModalBody>
            <VStack className="space-y-3 mt-1">
              <PricePlansInput
                pricePlans={pricePlans?.dataSource || []}
                fieldsType={pricePlanFieldsType}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-accent rounded-xl px-5"
              onPress={() => setOpenModal(false)}
            >
              {/* <ButtonText>
                {selectedPlan ? `Selected: ${selectedPlan.name}` : "Close"}
              </ButtonText> */}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <Box className="items-center h-[120px]">
      {" "}
      {/* Set fixed height here */}
      {!openingList && (
        <TouchableOpacity
          className="w-full flex-row items-center justify-between h-[80px] px-5 py-3 rounded-b-xl rounded-t-none shadow-md"
          style={{ backgroundColor: theme.accent }}
          onPress={() => setOpenModal(true)}
          onLayout={(e) => {
            console.log(e.nativeEvent.layout.width, "box width");
            setBoxWidth(e.nativeEvent.layout.width);
          }}
        >
          {/* Centered content */}
          <View
            className="flex-1 flex-col items-center justify-center" // Center vertically & horizontally
          >
            {/* Main text */}
            <Text
              className={
                "font-bold lett " + `${boxWidth < 350 ? "text-xs" : "text-md"}`
              } // Responsive text size
              numberOfLines={1}
              style={{
                color: theme.body,
                textAlign: "center",
                direction: "inherit",
              }}
            >
              {localization.menu.exploerMore || "Explore more plans"}
            </Text>

            {/* Put CardPriceDiscount under the text */}
            <CardPriceDiscount
              fieldsType={pricePlanFieldsType}
              item={item}
              boxWidth={boxWidth}
              style={{ marginTop: 4 }}
            />
          </View>

          {/* Arrow on the right */}
          <MaterialCommunityIcons
            name={isRTL() ? "chevron-left" : "chevron-right"}
            size={30}
            color={theme.body}
          />
        </TouchableOpacity>
      )}
      {/* Modal stays the same */}
      <RenderPricePlans />
    </Box>
  );
};

export default PricePlansSection;
