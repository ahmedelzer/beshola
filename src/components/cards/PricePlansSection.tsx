import React, { useState } from "react";
import { TouchableOpacity, Linking, I18nManager, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  Text,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  Divider,
} from "../../../components/ui";
import { useForm, Controller } from "react-hook-form";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";
import PricePlansInput from "./PricePlansInput";
import PricePlanSchemaActions from "../../Schemas/MenuSchema/PricePlanSchemaActions.json";
import PricePlanSchema from "../../Schemas/MenuSchema/PricePlanSchema.json";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import { getField } from "../../utils/operation/getField";
import CardPriceDiscount from "../../utils/component/CardPriceDiscount";
import { useSelector } from "react-redux";

const PricePlansSection = ({ item }) => {
    const localization = useSelector((state) => state.localization.localization);
  const [openModal, setOpenModal] = useState(false);
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
  const { data: pricePlans } = useFetchWithoutBaseUrl(query);
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });
  const parameters = PricePlanSchema.dashboardFormSchemaParameters;
  console.log(pricePlans, "pricePlans");
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
 
  return (
    <Box className="items-center h-[120px]"> {/* Set fixed height here */}
   <TouchableOpacity
    className="w-full flex-row items-center justify-between h-[80px] px-5 py-3 rounded-b-xl rounded-t-none shadow-md"
    style={{ backgroundColor: theme.accent }}
    onPress={() => setOpenModal(true)}
  >
    {/* Centered content */}
    <View
      className="flex-1 flex-col items-center justify-center" // Center vertically & horizontally
    >
      {/* Main text */}
      <Text
        className="font-bold text-md"
        style={{ color: theme.body, textAlign: "center", direction: "inherit" }}
      >
        {localization.menu.exploerMore || "Explore more plans"}
      </Text>

      {/* Put CardPriceDiscount under the text */}
      <CardPriceDiscount
        fieldsType={pricePlanFieldsType}
        item={item}
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


  {/* Modal stays the same */}
  <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
    <ModalBackdrop />
    <ModalContent className="rounded-2xl relative bg-body p-3 max-h-[80vh]">
      {/* ...rest of your modal content */}
    </ModalContent>
  </Modal>
</Box>
  );
};

export default PricePlansSection;
