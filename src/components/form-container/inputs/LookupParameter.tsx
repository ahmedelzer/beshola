import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";

import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../../../../components/ui";
import { usePreloadList } from "../../Pagination/usePreloadList";

function LookupParameter({
  fieldName,
  lookupID,
  lookupReturnField,
  lookupDisplayField,
  control,
  ...props
}) {
  const { data: _schemaActions } = useFetch(
    GetSchemaActionsUrl(props?.selectParam?.lookupID || lookupID),
    defaultProjectProxyRouteWithoutBaseURL,
  );
  const {
    rows,
    totalCount,
    handleScroll,
    // dispatch: reducerDispatch,
    state,
  } = usePreloadList({
    idField: fieldName,
    schemaActions: _schemaActions || [],
    row: { ...props?.row },
    cacheTime: 5000,
    deps: [],
  });
  const [selectedValue, setSelectedValue] = useState({});

  // Auto-select the first row once rows load
  useEffect(() => {
    if (state.rows?.length > 0) {
      const firstRow = state.rows[0];
      setSelectedValue(firstRow);

      // 🔥 log the value and type of setwatch

      props?.setwatch?.(lookupReturnField, firstRow?.[lookupReturnField] || "");
      // Call it if it exists
      props?.setValue?.(lookupReturnField, firstRow?.[lookupReturnField] || "");
    }
  }, [state.rows]);
  // useEffect(() => {
  //   console.log("selectedValue",selectedValue)
  //     props?.setwatch?.(selectedValue);
  //   }, [selectedValue]);
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View key={`${fieldName}-${selectedValue?.[lookupReturnField] || "none"}`}>
      <Select
        value={selectedValue?.[lookupReturnField] || ""}
        className="mx-2"
        onValueChange={(selectedKey) => {
          const selected = state.rows.find(
            (item) => item?.[lookupReturnField] === selectedKey,
          );

          setSelectedValue(selected || null);
          props?.setValue?.(
            lookupReturnField,
            selected?.[lookupReturnField] || "",
          );
          // propagate selection
        }}
      >
        <SelectTrigger
          variant="outline"
          size="sm"
          className="w-full h-11 flex flex-row justify-between"
        >
          <SelectInput
            placeholder={localization?.inputs?.select?.placeholder || "Select"}
            value={
              selectedValue?.[lookupDisplayField] ||
              state.rows?.[0]?.[lookupDisplayField] ||
              ""
            }
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

            {state.rows?.map((item) => (
              <SelectItem
                key={item?.[lookupReturnField]}
                label={item?.[lookupDisplayField]}
                value={item?.[lookupReturnField]}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
}

export default LookupParameter;
