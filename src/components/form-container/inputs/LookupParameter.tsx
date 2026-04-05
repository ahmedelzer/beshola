// import { Controller, useForm } from "react-hook-form";
// import { useSelector } from "react-redux";
// import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
// import { Text, View } from "react-native";
// import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
// import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
// import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";
// import { initialState, VIRTUAL_PAGE_SIZE } from "../../Pagination/initialState";
// import reducer from "../../Pagination/reducer";
// import { createRowCache } from "../../Pagination/createRowCache";
// import { buildApiUrl } from "../../../../components/hooks/APIsFunctions/BuildApiUrl";
// import LoadData from "../../../../components/hooks/APIsFunctions/LoadData";
// import { updateRows } from "../../Pagination/updateRows";
// import SelectParameter from "./SelectParameter";
// import { cleanObject } from "../../../utils/operation/cleanObject";
// import BaseRange from "../../../utils/component/BaseRange";

// function LookupParameter({
//   fieldName,
//   lookupID,
//   lookupReturnField,
//   lookupDisplayField,
//   control,
//   ...props
// }) {
//   const { data: _schemaActions } = useFetch(
//     GetSchemaActionsUrl(props?.selectParam?.lookupID||lookupID),
//     defaultProjectProxyRouteWithoutBaseURL,
//   );

//   const getAction =
//     _schemaActions?.find(
//       (action) => action.dashboardFormActionMethodType === "Get",
//     ) || null;

//   const [state, dispatch] = useReducer(
//     reducer,
//     initialState(VIRTUAL_PAGE_SIZE, fieldName),
//   );

//   const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

//   const dataSourceAPI = (query, skip, take) =>
//     buildApiUrl(query, {
//       pageIndex: skip + 1,
//       pageSize: take,
//       ...props?.rowDetails,
//     });

//   useEffect(() => {
//     console.log("lookup getAction",getAction)
//     if (!getAction) return;

//     LoadData(
//       state,
//       dataSourceAPI,
//       getAction,
//       cache,
//       updateRows(dispatch, cache, state),
//       dispatch,
//     );
//   }, [getAction, dataSourceAPI]);

//   // ✅ Auto-select the first row when rows load
//   // useEffect(() => {
//   //   if (!selectedRow && state.rows?.length > 0) {

//   //     setSelectedRow(state.rows[0]);

//   //   }
//   // }, [state.rows]);
//   const selectedRow = useRef({});
//  const [selectedValue,setSelectedValue] = useState(selectedRow.current)
//   useEffect(() => {
//      console.log("lookup0",state.rows?.length)
//     if (
//       Object.keys(selectedRow.current).length === 0 &&
//       state.rows?.length > 0
//     ) {
//       selectedRow.current = state.rows[0];
//       setSelectedValue(state.rows[0])
//       console.log("lookup1",state.rows?.length)
//     }

//   }, [state.rows]);

//   const localization = useSelector((state) => state.localization.localization);

//   return (

//     <View key={`${fieldName}-${selectedValue?.[lookupReturnField] || "none"}`}>
//       <SelectParameter
//         onValueChange={(selectedItem) => props?.setwatch(selectedItem)}
//         fieldName={fieldName}
//         values={state.rows || []}
//         lookupReturnField={lookupReturnField}
//         lookupDisplayField={lookupDisplayField}
//         value={selectedValue}
//         selectTheFirst={true}
//         customKey={`${fieldName}-${selectedValue?.[lookupReturnField] || "none"}`}
//         // onValueChange={(val) => {
//         //   console.log("val", val);

//         //   props?.setRowDetails({ ...props?.rowDetails, ...val });
//         //   setSelectedRow(val);
//         //   // onChange(val);
//         // }}
//         placeholder={localization?.inputs?.select?.placeholder || "Select"}
//         {...props}
//       />
//     </View>
//   );
// }

// export default LookupParameter;
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";
import { initialState, VIRTUAL_PAGE_SIZE } from "../../Pagination/initialState";
import reducer from "../../Pagination/reducer";
import { createRowCache } from "../../Pagination/createRowCache";
import { buildApiUrl } from "../../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../Pagination/updateRows";

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

  const getAction =
    _schemaActions?.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    ) || null;

  const [state, dispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, fieldName),
  );

  const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

  const dataSourceAPI = (query, skip, take) =>
    buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...props?.row,
    });

  useEffect(() => {
    if (!getAction) return;

    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction, dataSourceAPI]);

  const [selectedValue, setSelectedValue] = useState({});

  // Auto-select the first row once rows load
  useEffect(() => {
    if (state.rows?.length > 0) {
      const firstRow = state.rows[0];
      setSelectedValue(firstRow);

      // 🔥 log the value and type of setwatch

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
