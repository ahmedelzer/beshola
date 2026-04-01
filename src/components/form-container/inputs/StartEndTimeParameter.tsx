import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";

// Web imports
let DatePicker, registerLocale;
if (Platform.OS === "web") {
  const webImports = require("react-datepicker");
  DatePicker = webImports.default;
  registerLocale = webImports.registerLocale;
  require("react-datepicker/dist/react-datepicker.css");
}
const getSafeValue = (val, additionDays = 0, type) => {
  let date;

  if (!val) {
    // default today + additionDays
    date = new Date(Date.now() + additionDays * 24 * 60 * 60 * 1000);
  } else {
    date = new Date(val);
    if (isNaN(date.getTime())) {
      date = new Date(Date.now() + additionDays * 24 * 60 * 60 * 1000);
    }
  }

  if (type === "localDateTime") {
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  return date;
};
const StartEndTimeParameter = ({
  value = {},
  onChange,
  enable = true,
  setValue,
  formSchemaParameters = [],
  type,
}) => {
  const localization = useSelector((state) => state.localization.localization);
  const startField = formSchemaParameters?.find(
    (p) => p.parameterType === "startTime",
  );
  const endField = formSchemaParameters?.find(
    (p) => p.parameterType === "endTime",
  );

  const [startDate, setStartDate] = useState(
    startField ? getSafeValue(value[startField.parameterField], 0, type) : null,
  );

  const [endDate, setEndDate] = useState(
    endField ? getSafeValue(value[endField.parameterField], 30, type) : null,
  );

  const [pickerMode, setPickerMode] = useState("start");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = (mode) => {
    setPickerMode(mode);
    setPickerVisible(true);
  };
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (selected, mode = pickerMode) => {
    if (mode === "start") {
      setStartDate(selected);
      if (startField) {
        setValue(startField.parameterField, selected);
      }
      console.log("====================================");
      console.log(endDate, selected, "endDate");
      console.log("====================================");
      if (endDate && selected > endDate) setEndDate(null);
    } else {
      setEndDate(selected);
      if (endField) {
        setValue(endField.parameterField, selected);
      }
    }
    hidePicker();
  };

  const styles = StyleSheet.create({
    container: { flexDirection: "row", gap: 12, marginTop: 8 },
    touchable: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#3b82f6",
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
    },
    text: { fontSize: 16, color: "#000" },
  });

  // ---------------------- WEB ----------------------
  if (Platform.OS === "web") {
    // Optional: register locale if needed
    useEffect(() => {
      if (localization?.dateTime?.dxDateBox) {
        registerLocale("custom", {
          localize: {
            month: (n) => localization.dateTime.dxDateBox.months[n],
            day: (n) => localization.dateTime.dxDateBox.days[n].slice(0, 3),
            dayPeriod: (period) =>
              period === "am"
                ? localization.dateTime.dxDateBox.am
                : localization.dateTime.dxDateBox.pm,
          },
          formatLong: {
            date: () => "yyyy-MM-dd",
            time: () => "HH:mm",
            dateTime: () => "yyyy-MM-dd HH:mm",
          },
          options: {},
        });
      }
    }, []);

    return (
      <View style={styles.container}>
        {startField && (
          <DatePicker
            selected={startDate}
            onChange={(date) => handleConfirm(date, "start")}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select Start"
            className="form-control"
            minDate={new Date()}
            popperPlacement="bottom-start"
            popperClassName="z-[9999]"
            portalId="root-portal" // 👈 This makes the calendar render in a portal
            // popperContainer={({ children }) => (
            //   <div
            //     style={{ zIndex: 9999, position: "relative", minWidth: 1000 }}
            //   >
            //     {children}
            //   </div>
            // )}
          />
        )}
        {endField && (
          <DatePicker
            selected={endDate}
            onChange={(date) => handleConfirm(date, "end")}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select End"
            className="form-control"
            minDate={startDate || new Date()}
            popperPlacement="bottom-start"
            popperClassName="z-[9999]"
            portalId="root-portal" // 👈 This makes the calendar render in a portal
            popperContainer={({ children }) => (
              <div
                style={{ zIndex: 9999, position: "relative", minWidth: 1000 }}
              >
                {children}
              </div>
            )}
          />
        )}
      </View>
    );
  }

  // ------------------- MOBILE ---------------------
  return (
    <View style={styles.container}>
      {startField && (
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => enable && showPicker("start")}
        >
          <Text style={styles.text}>
            {startDate
              ? moment(startDate).format("DD/MM/YYYY HH:mm")
              : "Select Start"}
          </Text>
        </TouchableOpacity>
      )}
      {endField && (
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => enable && showPicker("end")}
        >
          <Text style={styles.text}>
            {endDate
              ? moment(endDate).format("DD/MM/YYYY HH:mm")
              : "Select End"}
          </Text>
        </TouchableOpacity>
      )}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        minimumDate={pickerMode === "end" && startDate ? startDate : new Date()}
        date={
          pickerMode === "start"
            ? startDate || new Date()
            : endDate || new Date()
        }
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
};

export default StartEndTimeParameter;
