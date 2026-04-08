import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";

import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  Input,
  InputField,
  VStack,
} from "../../../../components/ui";

import { MaterialIcons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import useFetch from "../../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../request";
import LoadingScreen from "../../../kitchensink-components/loading/LoadingScreen";
import { usePreloadList } from "../../Pagination/usePreloadList";

// ---------------- Schema Loader ----------------
const CheckBoxParameterSchemaLoader = ({ lookupID, children }) => {
  const { data: schema, isLoading } = useFetch(
    `/Dashboard/GetDashboardFormSchemaBySchemaID?DashboardFormSchemaID=${lookupID}`,
    defaultProjectProxyRouteWithoutBaseURL,
  );

  const { data: schemaActions } = useFetch(
    GetSchemaActionsUrl(lookupID),
    defaultProjectProxyRouteWithoutBaseURL,
  );

  if (isLoading) return <LoadingScreen />;

  return children({ schema, schemaActions });
};

// ---------------- State Manager ----------------
const CheckBoxParameterState = ({
  schema,
  schemaActions,
  value = [],
  fieldName,
  enable = true,
  control,
  lookupDisplayField,
  lookupReturnField,
}) => {
  const {
    rows,
    totalCount,
    handleScroll,
    // dispatch: reducerDispatch,
    state,
  } = usePreloadList({
    idField: schema?.idField,
    schemaActions: schemaActions,
    row: {},
    cacheTime: 5000,
    deps: [],
  });
  const [values, setValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState(value[fieldName] || []);

  useEffect(() => {
    if (state.rows?.length) {
      setValues(state.rows);
    }
  }, [state.rows]);

  const handleChange = (selectedKeys, formOnChange) => {
    setSelectedValues(selectedKeys);

    if (formOnChange) {
      formOnChange(selectedKeys);
    }
  };

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange: formOnChange } }) => (
        <View>
          <CheckboxGroup
            value={selectedValues}
            onChange={(selectedKeys) =>
              handleChange(selectedKeys, formOnChange)
            }
            isDisabled={!enable}
          >
            <VStack space="xl">
              {values.map((item) => {
                const display = item[lookupDisplayField];
                const val = item[lookupReturnField];

                return (
                  <Checkbox key={val} value={val}>
                    <CheckboxIndicator>
                      <CheckboxIcon
                        as={
                          Platform.OS == "web"
                            ? () => (
                                <MaterialIcons
                                  name="check"
                                  size={20}
                                  color="white"
                                />
                              )
                            : CheckIcon
                        }
                      />
                    </CheckboxIndicator>

                    <CheckboxLabel>{display}</CheckboxLabel>
                  </Checkbox>
                );
              })}
            </VStack>
          </CheckboxGroup>

          {/* Hidden field to submit values */}
          <Input
            variant="outline"
            className={"w-0 h-0 opacity-0"}
            size="md"
            isDisabled={false}
            isReadOnly={true}
          >
            <InputField
              value={JSON.stringify(selectedValues)}
              editable={false}
              onChangeText={() => {}}
              defaultValue={JSON.stringify(selectedValues)}
            />
          </Input>
        </View>
      )}
    />
  );
};

// ---------------- Main Export ----------------
const CheckBoxParameter = (props) => {
  const { lookupID } = props;

  return (
    <CheckBoxParameterSchemaLoader lookupID={lookupID}>
      {({ schema, schemaActions }) => (
        <CheckBoxParameterState
          {...props}
          schema={schema}
          schemaActions={schemaActions}
        />
      )}
    </CheckBoxParameterSchemaLoader>
  );
};

export default CheckBoxParameter;
