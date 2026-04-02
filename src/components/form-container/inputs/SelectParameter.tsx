import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
} from "../../../../components/ui";
import { useSelector } from "react-redux";

function SelectParameter({
  values = [], // Array of objects with { label, value }
  value: defaultValue,
  fieldName,
  enable = true,
  lookupDisplayField,
  lookupReturnField,
  selectTheFirst = false,
  onValueChange,
  ...props
}) {
  const localization = useSelector((state) => state.localization.localization);
  console.log(values, "selectedRow in lookup parameter");

  // Local state for selected item
  const [selectedValue, setSelectedValue] = useState(
    defaultValue ? defaultValue[lookupReturnField] : "",
  );

  // Apply selectTheFirst on mount if no default value
  useEffect(() => {
    if (selectTheFirst && !selectedValue && values?.length > 0) {
      setSelectedValue(values[0][lookupReturnField]);
      console.log("selectTheFirst applied:", values[0]);
      onValueChange?.(values[0]); // optional callback to parent
    }
  }, [selectTheFirst, selectedValue, values, onValueChange]);

  const selectedItem = values.find(
    (item) => item?.[lookupReturnField] === selectedValue,
  );

  return (
    <View>
      <Select
        value={selectedItem?.[lookupReturnField] || ""}
        className="mx-2"
        onValueChange={(displayValue) => {
          const selected = values.find(
            (item) => item?.[lookupDisplayField] === displayValue,
          );
          setSelectedValue(selected?.[lookupReturnField] || "");
          console.log("Selected item:", selected);
          onValueChange?.(selected);
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
          <SelectIcon as={AntDesign} name="down" className="mr-3 text-text" />
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
                label={item?.[lookupDisplayField]}
                value={item?.[lookupDisplayField]}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
}

export default SelectParameter;
