import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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

export default function PricePlansInput({ pricePlans }) {
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });

  const selectedPlanIndex = watch("selectedPlan");
  const selectedPlan = pricePlans[selectedPlanIndex];

  const handleOpenMap = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location,
    )}`;
    Linking.openURL(url);
  };

  return (
    <Controller
      control={control}
      name="selectedPlan"
      render={({ field: { value } }) =>
        pricePlans.map((plan, index) => {
          const isSelected = value === index.toString();
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => setValue("selectedPlan", index.toString())}
              className={isSelected && `!border-accentHover`}
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <Accordion
                type="single"
                collapsible
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
                          style={{ direction: "inherit" }}
                        >
                          <MaterialCommunityIcons
                            name={plan.icon || "cube-outline"}
                            size={20}
                            color={theme.secondary}
                          />
                          <Text
                            className="text-md font-bold"
                            // style={{ color: theme.secondary }}
                          >
                            {plan.name}
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
                    <VStack className="space-y-2">
                      <Text className="text-text text-sm">
                        Price:{" "}
                        <Text className="text-accent font-bold">
                          {plan.price}
                        </Text>
                      </Text>
                      {plan.area && (
                        <Text className="text-text text-sm">
                          Area: {plan.area} m²
                        </Text>
                      )}
                      {plan.paymentPlan && (
                        <Text className="text-text text-sm">
                          Payment: {plan.paymentPlan}
                        </Text>
                      )}
                      {plan.deliveryDate && (
                        <Text className="text-text text-sm">
                          Delivery: {plan.deliveryDate}
                        </Text>
                      )}
                      {plan.location && (
                        <TouchableOpacity
                          onPress={() => handleOpenMap(plan.location)}
                          className="bg-primary flex-row items-center px-2 py-1 rounded-lg w-fit mt-1"
                        >
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={16}
                            color={theme.body}
                          />
                          <Text className="text-body text-xs ml-1">
                            {plan.location}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </VStack>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TouchableOpacity>
          );
        })
      }
    />
  );
}
