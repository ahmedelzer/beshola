import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  findNodeHandle,
  Platform,
} from "react-native";
//@ts-ignore
import { Column, Grid, Row } from "react-native-responsive-grid";
import { SmMobile, SmWeb } from "./Sm";

import DataCellRender from "./DataCellRender";
import {
  Button,
  ButtonText,
  CloseIcon,
  HelpCircleIcon,
  HStack,
  Icon,
  Pressable,
  VStack,
} from "../../../components/ui";
import { useDeviceInfo } from "../../utils/component/useDeviceInfo";
import SetComponentsPlatforms from "../../utils/component/SetComponentsPlatforms";
import { WebContainer } from "./WebContainer";
import { MobileContainer } from "./MobileContainer";
import { useEffect, useRef } from "react";
import { useDisplayToast } from "./ShowToast";
import { useSelector } from "react-redux";
import { isRTL } from "../../utils/operation/isRTL";
// import { useToastUtils } from "./ShowErrorToast";
function FormContainer({
  tableSchema,
  row,
  errorResult,
  control,
  shouldDisplayErrorInForm = false,
  ...props
}: any) {
  const errors = errorResult?.error?.errors || {};
  const { showToast } = useDisplayToast();
  const localization = useSelector((state) => state.localization.localization);

  // Convert error keys to lowercase
  const lowercaseErrors = Object.keys(errors).reduce((acc, key) => {
    acc[key.toLowerCase()] = errors[key];
    return acc;
  }, {});

  // Get expected field names from schema
  const expectedFields =
    tableSchema?.dashboardFormSchemaParameters?.map((param: any) =>
      param.parameterField?.toLowerCase(),
    ) || [];
  const scrollViewRef = useRef<ScrollView>(null);
  const errorRef = useRef<View>(null);
  // Get unmatched error messages (e.g., "userError")
  // const globalErrorMessages = [["test"], ["test1"]]; // get message(s)
  const globalErrorMessages = Object.entries(lowercaseErrors)
    .filter(([key]) => !expectedFields.includes(key)) // key not found in schema
    .map(([_, message]) => message); // get message(s)
  const actionField = tableSchema?.dashboardFormSchemaParameters?.find(
    (e: any) => e?.isEnable,
  )?.parameterField;
  // Show toast on global errors
  // Show the first global error as toast

  const lastShownErrorRef = useRef<string | null>(null); // track last error shown

  useEffect(() => {
    const currentError = globalErrorMessages[0];

    if (currentError && lastShownErrorRef.current !== currentError) {
      lastShownErrorRef.current = currentError;
      // Always wrap in setTimeout to let React commit before showing
      setTimeout(() => {
        showToast(
          localization.inputs.notifyError,
          currentError,
          "error",
          "outline",
          "top",
        );
      }, 0);
    }
  }, [globalErrorMessages, showToast, localization.inputs.notifyError]);
  useEffect(() => {
    if (!shouldDisplayErrorInForm || globalErrorMessages.length === 0) return;

    setTimeout(() => {
      if (Platform.OS === "web" && errorRef.current) {
        // Web version: use DOM API directly
        const element = errorRef.current as unknown as HTMLElement;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (scrollViewRef.current && errorRef.current?.measure) {
        // Native version
        errorRef.current.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({
            y: pageY - 50, // small offset for better visibility
            animated: true,
          });
        });
      }
    }, 300);
  }, [shouldDisplayErrorInForm, globalErrorMessages]);
  function SetValue(param: any | undefined) {
    if (
      param.lookupID ||
      param.parameterType === "areaMapLongitudePoint" ||
      param.parameterType === "mapLongitudePoint" ||
      param.parameterType === "rate"
    ) {
      return row;
    } else {
      return row[param.parameterField];
    }
  }

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <SetComponentsPlatforms
        components={[
          {
            platform: "android",
            component: (
              <MobileContainer
                SetValue={SetValue}
                actionField={actionField}
                control={control}
                errorResult={errorResult}
                tableSchema={tableSchema}
                {...props}
              />
            ),
          },
          {
            platform: "ios",
            component: (
              <MobileContainer
                SetValue={SetValue}
                actionField={actionField}
                control={control}
                errorResult={errorResult}
                tableSchema={tableSchema}
                {...props}
              />
            ),
          },
          {
            platform: "web",
            component: (
              <WebContainer
                SetValue={SetValue}
                actionField={actionField}
                control={control}
                errorResult={errorResult}
                tableSchema={tableSchema}
                {...props}
              />
            ),
          },
        ]}
      />
      {globalErrorMessages.length > 0 && shouldDisplayErrorInForm && (
        <View ref={errorRef} className="flex-row justify-center items-center">
          <Text className="text-error-500 text-xl font-bold">
            {globalErrorMessages[0].join("")}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
export default FormContainer;
