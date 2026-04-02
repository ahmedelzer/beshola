import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import useFetch from "../../../../../components/hooks/APIsFunctions/useFetch";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../../../request";
import GetSchemaActionsUrl from "../../../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import LoadingScreen from "../../../../kitchensink-components/loading/LoadingScreen";
import reducer from "../../../Pagination/reducer";
import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../../../Pagination/initialState";
import { createRowCache } from "../../../Pagination/createRowCache";
import { buildApiUrl } from "../../../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../../Pagination/updateRows";
import { Controller } from "react-hook-form";
import { Input, InputField } from "../../../../../components/ui";
import RequsetTimeSchema from "../../../../Schemas/MenuSchema/RequsetTimeSchema.json";
import { drawTimeLine } from "../../../../utils/operation/drawTimeLine";
import { handleSubmitWithCallback } from "../../../../utils/operation/handleSubmitWithCallback";
import { getField } from "../../../../utils/operation/getField";
import { combineDateTime } from "../../../../utils/operation/timeOperations";
import { theme } from "../../../../Theme";
const testSchema = {
  dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
  schemaType: "Table",
  idField: "attributeID",
  dashboardFormSchemaInfoDTOView: {
    dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
    schemaHeader: "Attribute",
    addingHeader: "Add Attribute",
    editingHeader: "Edit Attribute",
  },
  dashboardFormSchemaParameters: [
    {
      dashboardFormSchemaParameterID: "dcd85c5d-0736-41e6-90b4-712fcc81960d",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "attributeID",
      parameterTitel: "Attribute ID",
      parameterLookupTitel: "Attribute ID",
      isIDField: true,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 1,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
    {
      dashboardFormSchemaParameterID: "e16f5661-96af-439d-8bc7-c465ecb8b31f",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "availableSlots",
      parameterTitel: "Available Slots",
      parameterLookupTitel: null,
      isIDField: false,
      lookupID: "188a7178-8a86-40bb-a127-0ec49b0b9b9d",
      lookupReturnField: "attributeValueID",
      lookupDisplayField: "attributeValue",
      indexNumber: 2,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
  ],
  projectProxyRoute: "BrandingMartDefinitions",
  isMainSchema: true,
  dataSourceName: "string",
  propertyName: "string",
  indexNumber: 0,
};

// ---------------- State Manager ----------------
const CalendarParameterState = ({
  value = {},
  childSchema: schema,
  fieldName,
  control,
  parentRow,
  schemaActions,
  setValue,
}) => {
  const formatDate = (date) => {
    if (!date) return null;

    if (typeof date === "string") {
      return date.split("T")[0]; // handles ISO
    }

    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }

    return null;
  };
  const timeBounder = {
    startTime: "12:00",
    endTime: "18:00",
    duration: "15", //that time duration between each time
  };
  const parameters = schema?.dashboardFormSchemaParameters ?? [];

  const fieldsType = {
    availableSlots: getField(parameters, "hiddenAvailableSlots"),
    previewTime: getField(parameters, "hiddenCalenderDateTime"),
    booked: getField(parameters, "hiddenBooked"),
    calendar: getField(parameters, "calendar"),
  };
  const today = new Date().toISOString().split("T")[0]; // format: yyyy-mm-dd

  const [selectedValues, setSelectedValues] = useState(value[fieldName] || []);

  const [selectedDate, setSelectedDate] = useState(
    formatDate(parentRow?.[fieldName]) || today,
  );
  const [reqError, setReqError] = useState(null);
  const [disable, setDisable] = useState(false);
  const getAction =
    schemaActions &&
    schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const [state, dispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, schema?.idField),
  );
  const [currentSkip, setCurrentSkip] = useState(0);

  const cache = createRowCache(VIRTUAL_PAGE_SIZE);

  const [values, setValues] = useState([]);

  const dataSourceAPI = (query, skip, take) =>
    buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      date: selectedDate,
      ...parentRow,
    });

  // Load data
  useEffect(() => {
    if (!getAction) return;

    // dispatch({ type: "RESET_ROWS" });

    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction, currentSkip]);

  const handleChange = (selectedKeys, formOnChange) => {
    setSelectedValues(selectedKeys);

    if (formOnChange) {
      formOnChange(selectedKeys);
    }
  };
  const availability = {};

  const [selectedTime, setSelectedTime] = useState(parentRow[fieldName]);

  // 🎯 Mark available + selected days
  // const markedDates = useMemo(() => {
  //   const marks = {};

  //   Object.keys(availability).forEach((date) => {
  //     marks[date] = {
  //       marked: true,
  //       dotColor: "green",
  //     };
  //   });

  //   if (selectedDate) {
  //     marks[selectedDate] = {
  //       ...marks[selectedDate],
  //       selected: true,
  //       selectedColor: "#3b82f6",
  //     };
  //   }

  //   return marks;
  // }, [selectedDate]);
  const timeline = drawTimeLine(
    selectedTime, // focusTime
    timeBounder,
    fieldsType.booked,
    fieldsType.availableSlots,
    fieldsType.previewTime,
    state.rows,
  );
  const isBooked = timeline.find((item) => item.isBooked) ? true : false;
  // const onSubmit = async () => {
  //   await handleSubmitWithCallback({
  //     data: {
  //       [fieldsType.previewTime]: combineDateTime(selectedDate, selectedTime),
  //       ...parentRow,
  //     },
  //     setDisable,
  //     action: postAction,
  //     proxyRoute: postAction.projectProxyRoute,
  //     setReq: setReqError,
  //     onSuccess: (resultData) => {
  //       console.log("====================================");
  //       console.log(resultData, "resultData");
  //       console.log("====================================");
  //       // AddAddressLocation(resultData);
  //       // setIsModalVisible(false);

  //       // dispatch(updateSelectedLocation(resultData));
  //       // setSelectedLocation(resultData);
  //     },
  //   });
  // };

  // Set today as default when component mounts
  // useEffect(() => {
  //   // if (control) {
  //   // Update the form's field value
  //   setValue(fieldName, selectedDate);
  //   // setValue(
  //   //   fieldsType.previewTime,
  //   //   combineDateTime(selectedDate, selectedTime),
  //   // );
  //   // }
  // }, [selectedDate]);
  useEffect(() => {
    dispatch({
      type: "RESET_SERVICE_LIST",
      payload: { lastQuery: "" },
    });

    setCurrentSkip((prev) => prev + 1);
  }, [selectedDate]);

  return (
    <Controller
      control={control}
      name={fieldsType.previewTime}
      render={({ field: { onChange: formOnChange, value } }) => (
        <View>
          {/* 📅 Calendar */}
          <Calendar
            current={selectedDate}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: theme.accent, // 🔵 background color
                selectedTextColor: theme.body, // ⚪ text color
              },
            }}
            onDayPress={(day) => {
              // if (!availability[day.dateString]) return; // disable unavailable
              setSelectedDate(day.dateString);
              setSelectedTime(null);
            }}
            theme={{
              todayTextColor: theme.accent,
              arrowColor: theme.accent,
            }}
          />

          {/* ⏰ Time Slots */}
          {selectedDate && (
            <View className="mt-6">
              <Text className="text-lg font-bold mb-3">Available Times</Text>

              {timeline.length === 0 ? (
                <Text className="text-gray-500">No times available</Text>
              ) : (
                <FlatList
                  data={timeline}
                  numColumns={3}
                  keyExtractor={(item, index) => item}
                  renderItem={({ item, index }) => {
                    const isSelected = item.time === selectedTime;

                    return (
                      <TouchableOpacity
                        key={index}
                        disabled={isBooked || item.availableSlots === 0}
                        onPress={() => {
                          setSelectedTime(item.time);
                          formOnChange(
                            combineDateTime(selectedDate, item.time),
                          );
                        }}
                        className={`m-2 px-4 py-3 rounded-xl flex-1 items-center ${
                          item.isBooked || isSelected
                            ? "bg-accent"
                            : item.availableSlots === 0
                              ? "bg-error"
                              : "bg-border"
                        }`}
                      >
                        <Text className={"text-body font-bold"}>
                          {item.time}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
      )}
    />
    // <></>
  );
};

// ---------------- Main Export ----------------
const CalendarParameter = (props) => {
  return (
    <CalendarParameterState
      {...props}
      // schemaActions={schemaActions}
    />
  );
};

export default CalendarParameter;
