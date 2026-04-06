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

type PricePlanProps = {
  plan: { name?: string; [key: string]: any };
  fieldsType?: { id?: string; [key: string]: any };
  setValue: (name: string, value: string) => void;
  index: number;
  isSelected?: boolean;
};

export default function PricePlan({
  plan,
  fieldsType,
  setValue,
  index,
  isSelected = false,
}: PricePlanProps) {
  console.log("====================================");
  console.log(index, isSelected, "index");
  console.log("====================================");
  const itemValue = `plan-${index}`;
  return (
    <TouchableOpacity
      key={plan?.[fieldsType?.id] || index}
      activeOpacity={0.8}
      onPress={() => setValue("selectedPlan", index.toString())}
      className={isSelected ? "!border-accentHover" : ""}
      style={{
        borderWidth: isSelected ? 2 : 1,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      <Accordion
        type="single"
        collapsable
        // If isExpanded is true, we set this item's value as the default
        defaultValue={index === 0 ? itemValue : undefined}
        className={`bg-bg-body rounded-xl shadow-sm ${
          isSelected ? "bg-bg-selected" : ""
        }`}
      >
        <AccordionItem value={`plan-${index}`}>
          <AccordionHeader>
            <AccordionTrigger>
              <HStack
                className={`justify-between items-center w-full ${
                  isRTL() ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ padding: 12 }}
              >
                <HStack
                  className={`items-center space-x-2 ${
                    isRTL() ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={20}
                    color={theme.secondary}
                  />

                  <Text className="text-md font-bold">
                    {plan?.name || `Plan ${index + 1}`}
                  </Text>
                </HStack>

                <AccordionIcon
                  as={() => (
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={22}
                      color={theme.text}
                    />
                  )}
                />
              </HStack>
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionContent className="bg-bg-tertiary rounded-b-xl px-4 py-3">
            <Divider className="my-2 bg-outline-50" />

            {/* PLAN SUMMARY */}
            <PricePlanSummary
              plan={plan} // ✅ fixed
              schemaFieldsTypes={fieldsType}
              isExpanded={index === 0 ? true : false}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TouchableOpacity>
  );
}
