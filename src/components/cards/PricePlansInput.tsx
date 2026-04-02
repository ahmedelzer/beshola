import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, TouchableOpacity } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
  Divider,
  HStack,
  Text,
  VStack,
} from "../../../components/ui";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";
import PricePlanSummary from "../../kitchensink-components/cart/InvoiceSummary";
import PricePlan from "./PricePlan";

export default function PricePlansInput({ pricePlans = [], fieldsType }) {
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });

  const selectedPlanIndex = watch("selectedPlan");

  return (
    <Controller
      control={control}
      name="selectedPlan"
      render={({ field: { value } }) => (
        <>
          {pricePlans.map((plan, index) => {
            const isSelected = value === index.toString();

            const name = plan?.[fieldsType?.name];

            return (
              <PricePlan
                plan={plan}
                fieldsType={fieldsType}
                setValue={setValue}
                index={index}
                isSelected={isSelected}
              />
            );
          })}
        </>
      )}
    />
  );
}
