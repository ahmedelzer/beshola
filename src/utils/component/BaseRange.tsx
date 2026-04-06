import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import LookupParameter from "../../components/form-container/inputs/LookupParameter";
import APIHandling from "../../../components/hooks/APIsFunctions/APIHandling";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { MiddleRangeParameter } from "../../components/form-container";
import { theme } from "../../Theme";
import { useSelector } from "react-redux";
import { cleanObject } from "../operation/cleanObject";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../request";
import SchemaTabs from "./SchemaTabs";
// Import your specific range component

const BaseRange = ({ schema }) => {
  const {
    control,
    setValue,

    formState: { errors },
  } = useForm({});
  const [rowDetails, setRowDetails] = useState({});
  const [apiValues, setApiValues] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [lastQuery, setLastQuery] = useState(null);
  const [watch, setwatch] = useState({});
  const localization = useSelector((state) => state.localization.localization);

  const selectParam = schema.dashboardFormSchemaParameters.find(
    (param) => param.lookupID !== null,
  );

  // Get range parameters from subSchema
  const rangeParams = useMemo(
    () =>
      schema?.dashboardFormSchemaParameters.filter(
        (param) => param.parameterType === "range",
      ) || [],
    [schema],
  );
  const { data: _schemaActions } = useFetch(
    GetSchemaActionsUrl(schema.dashboardFormSchemaID),
    defaultProjectProxyRouteWithoutBaseURL,
  );

  const getAction =
    _schemaActions &&
    _schemaActions.find((a) => a.dashboardFormActionMethodType === "Get");

  useEffect(() => {
    if (!getAction || Object.keys(rowDetails).length === 0) return;

    const run = async () => {
      const query = buildApiUrl(getAction, {
        pageIndex: 1,
        pageSize: 100,
        ...rowDetails,
      });

      if (query !== lastQuery) {
        setLastQuery(query);
        const result = await APIHandling(
          query,
          getAction.dashboardFormActionMethodType,
          {},
        );
        if (result?.success) {
          // Expecting result.data to be { totalPrice: {min: 0, max: 100}, ... }
          setApiValues(result?.data || {});
        }
      }
    };
    run();
  }, [getAction, rowDetails]);
  useEffect(() => {
    // Clean object is optional if you want to remove empty/undefined values

    setRowDetails(() => watch);
    // setRootRow({ ...rootRow, ...cleanedValues });
  }, [watch]);

  // Current selected parameter metadata
  const currentParam = rangeParams[activeTab];

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* 1. Lookup Selection */}
      {selectParam && (
        <View style={{ marginBottom: 20 }}>
          <LookupParameter
            fieldName={selectParam.parameterField}
            lookupDisplayField={selectParam.lookupDisplayField}
            lookupReturnField={selectParam.lookupReturnField}
            value={""}
            control={control}
            setwatch={setwatch}
            selectParam={selectParam}
            setValue={setValue}
            rowDetails={{}}
          />
        </View>
      )}

      {/* 2. Tabs */}
      <View style={{ marginBottom: 15 }}>
        <SchemaTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fieldsType={{
            id: "dashboardFormSchemaParameterID",
            title: "parameterTitel",
          }}
          params={rangeParams}
        />
      </View>

      {/* 3. The Slider: Replaced DataCellRender with MiddleRangeParameter */}
      <View className="bg-body rounded-xl p-4 shadow-sm border">
        {currentParam ? (
          <MiddleRangeParameter
            key={`${currentParam.parameterField}-${activeTab}`}
            fieldName={currentParam.parameterField}
            control={control}
            invalidInput={""}
            // Pass the specific nested object (e.g., apiValues.totalPrice)
            // If API hasn't loaded yet, default to a safe 0-500 range
            value={
              apiValues?.[currentParam.parameterField] || { min: 0, max: 500 }
            }
          />
        ) : (
          <Text className="text-center text-gray-400">
            {localization.Hum_screens.menu.filter.rangeInput.paramNotFound}
          </Text>
        )}
      </View>
    </View>
  );
};

export default BaseRange;
