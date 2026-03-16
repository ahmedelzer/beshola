import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  TextareaInput,
} from "../../../../components/ui";
import { useSelector } from "react-redux";
function SelectParameter1({
  values = [], // Array of objects with { label, value }
  value: defaultValue,
  fieldName,
  enable = true,
  control,
  lookupDisplayField,
  lookupReturnField,
  ...props
}) {
  const localization = useSelector((state) => state.localization.localization);
  // const [selectedValue, setSelectedValue] = useState(value); // Selected value
  // const [isFocus, setIsFocus] = useState(false);
  // // Prepare dropdown options
  // const dropdownData = values.map((val) => ({
  //   label: val, // Display value
  //   value: val, // Actual value
  // }));
  // const renderLabel = () => {
  //   if (selectedValue || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: "blue" }]}>
  //         {fieldName || "Select an option"}
  //       </Text>
  //     );
  //   }
  //   return null;
  // };
  return (
    <View>
<Controller
  control={control}
  name={fieldName}
  render={({ field: { onChange, value } }) => {
    const selectedItem = values.find(
      (item) => item?.[lookupReturnField] === value
    );

    return (
      <Select
        value={value}
        className="mx-2"
        onValueChange={(displayValue) => {
          
          const selected = values.find(
            (item) => item?.[lookupDisplayField] === displayValue
          );
props?.onValueChange(selected)
          onChange(selected?.[lookupReturnField]); // save hidden return value
        }}
      >
        <SelectTrigger
          variant="outline"
          size="sm"
          className="w-full h-11 flex flex-row justify-between"
        >
          <SelectInput
            placeholder={localization.inputs.select.placeholder}
            value={selectedItem?.[lookupDisplayField] || ""}
            className="text-base text-text"
          />

          <SelectIcon
            as={AntDesign}
            name="down"
            className="mr-3 text-text"
          />
        </SelectTrigger>

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>

            {values.map((item) => (
              <SelectItem
                key={item?.[lookupReturnField]}
                label={item?.[lookupDisplayField]}   // visible text
                value={item?.[lookupDisplayField]}   // UI value
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    );
  }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default SelectParameter1;