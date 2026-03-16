import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { View } from "react-native";
import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";
import { initialState, VIRTUAL_PAGE_SIZE } from "../../Pagination/initialState";
import reducer from "../../Pagination/reducer";
import { createRowCache } from "../../Pagination/createRowCache";
import { buildApiUrl } from "../../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../Pagination/updateRows";
import SelectParameter from "./SelectParameter";
import { cleanObject } from "../../../utils/operation/cleanObject";
import BaseRange from "../../../utils/component/BaseRange";

function LookupParameter({
  fieldName,
  lookupID,
  lookupReturnField,
  lookupDisplayField,
  control,
  ...props
}) {
  const { data: _schemaActions } = useFetch(
    GetSchemaActionsUrl(props?.selectParam?.lookupID),
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
      ...props?.rowDetails,
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


  
  // ✅ Auto-select the first row when rows load
  // useEffect(() => {
  //   if (!selectedRow && state.rows?.length > 0) {

  //     setSelectedRow(state.rows[0]);

  //   }
  // }, [state.rows]);
  const selectedRow = useRef({});

useEffect(() => {
  if (Object.keys(selectedRow.current).length === 0 && state.rows?.length > 0) {
    selectedRow.current = state.rows[0];
  }

  console.log("selectedRow", selectedRow.current, state.rows);
}, [state.rows]);

  const localization = useSelector((state) => state.localization.localization);
  return (
    <View  key={`${fieldName}-${selectedRow?.[lookupReturnField] || "none"}`}>
<SelectParameter
  
     onValueChange={(selectedItem) => props?.setwatch(selectedItem)}
      fieldName={fieldName}
      values={state.rows || []}
      lookupReturnField={lookupReturnField}
      lookupDisplayField={lookupDisplayField}
      value={selectedRow}
      selectTheFirst ={true}
      // onValueChange={(val) => {
      //   console.log("val", val);

      //   props?.setRowDetails({ ...props?.rowDetails, ...val });
      //   setSelectedRow(val);
      //   // onChange(val);
      // }}
      placeholder={localization?.inputs?.select?.placeholder || "Select"}
      {...props}
    />
    </View>
    
  );
}

export default LookupParameter;
