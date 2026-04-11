import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import SelectParameter from "./SelectParameter";
import { useForm } from "react-hook-form";
import { cleanObject } from "../../../utils/operation/cleanObject";
import { useSearch } from "../../../../context/SearchProvider";
import { addAlpha } from "../../../utils/operation/addAlpha";
import { theme } from "../../../Theme";

function ListOfKeywordsParameter({
  values = [],
  parentID = "parentID",
  fieldName = "",
  lookupDisplayField = "label",
  lookupReturnField = "value",
  col = 1,
  filtersMap = new Map(), // default to an empty Map
  setParentRow = () => {},
  parentRow = [],
}) {
  // const { filtersMap } = useSearch();

  const current = filtersMap.get(parentID) || [];

  const [options, setOptions] = useState(
    values.filter((e) => !current.includes(e)),
  );
  const [watch, setwatch] = useState({});

  // watch select changes
  useEffect(() => {
    const value = values.find(
      (e) => e?.[lookupReturnField] === watch?.[lookupReturnField],
    );
    const returned = value?.[lookupReturnField];
    const selected = value?.[lookupDisplayField];

    if (!selected) return;

    // add keyword
    const current = filtersMap.get(parentID) || [];
    if (
      !current.some((e) => e[lookupReturnField] === value[lookupReturnField])
    ) {
      filtersMap.set(parentID, [...current, value]);
    }
    setParentRow((prev) => {
      if (prev.includes(returned)) return prev;
      return [...prev, returned];
    });

    // remove from select options
    if (!value) return; // make sure value exists

    // reset select
    //  reset({ attributeValue: "" });
  }, [watch]);

  const removeKeyword = (index) => {
    const current = filtersMap.get(parentID) || [];
    const newKeywords = current.filter((_, i) => i !== index);

    filtersMap.set(parentID, newKeywords);

    setParentRow((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <SelectParameter
        values={options}
        fieldName={lookupReturnField}
        onValueChange={(selectedItem) => setwatch(selectedItem)}
        lookupDisplayField={lookupDisplayField}
        lookupReturnField={lookupReturnField}
        value={""}
      />

      {/* Keywords */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
          gap: 8,
        }}
      >
        {(filtersMap.get(parentID) || parentRow).map((item, index) => {
          console.log("====================================");
          console.log("Rendering keyword item:", {
            item,
            values,
            lookupReturnField,
            lookupDisplayField,
          });
          console.log("====================================");
          const display =
            values.find((v) => v[lookupReturnField] === item[lookupReturnField])?.[
              lookupDisplayField
            ] || null;
            console.log("Rendering keyword display",display)
          const value =
            values.find((v) => v[lookupReturnField] === item[lookupReturnField])?.[
              lookupReturnField
            ] || null;
          if (!display || !value) return null;
          return (
            <View
              key={value}
              //key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.accent,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ marginRight: 6, color: theme.body }}>
                {display}
              </Text>

              <Pressable onPress={() => removeKeyword(index)}>
                <Text style={{ color: theme.body, fontWeight: "bold" }}>×</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
  return;
}

export default ListOfKeywordsParameter;
