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

const PricePlansSection = ({ item, openingList = false, variant = "" }) => {
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
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Box className="items-center h-[120px]">
      {!openingList && (
        <TouchableOpacity
          className={`w-full items-center justify-between ${
            variant === "small" ? "h-[60px]" : "h-[80px] flex-row"
          } px-3 py-2 rounded-b-xl rounded-t-none shadow-md`}
          style={{ backgroundColor: theme.accent }}
          onPress={() => setOpenModal(true)}
          onLayout={(e) => setBoxWidth(e.nativeEvent.layout.width)}
        >
          {/* 1. Left placeholder to balance the arrow on the right for true centering */}
          {variant !== "small" && <View style={{ width: 24 }} />}

          {/* 2. Middle Wrapper: flex-1 makes it fill the center */}
          <View className="justify-center items-center overflow-hidden ">
            {/* Row 1: Text */}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme.body,
                fontWeight: "bold",
                fontSize: variant === "small" ? 10 : 16,
                textAlign: "center", // Ensures text is centered within its box
                width: "100%",
              }}
            >
              {localization.menu.exploerMore || "Explore more plans"}
            </Text>

            {/* Row 2: Discount */}
            <View
              style={{
                marginTop: variant === "small" ? 0 : 4,
                alignItems: "center",
              }}
            >
              <CardPriceDiscount
                fieldsType={pricePlanFieldsType}
                item={item}
                variant={variant}
                boxWidth={boxWidth}
              />
            </View>
          </View>

          {/* 3. Right Side: Arrow */}
          {variant !== "small" ? (
            <MaterialCommunityIcons
              name={isRTL() ? "chevron-left" : "chevron-right"}
              size={24}
              color={theme.body}
            />
          ) : (
            /* Empty view for small variant to maintain centering logic if needed */
            <View style={{ width: 0 }} />
          )}
        </TouchableOpacity>
      )}
      <RenderPricePlans />
    </Box>
  );
};

export default PricePlansSection;
