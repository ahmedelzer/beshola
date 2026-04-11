import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import { useNavigation } from "@react-navigation/native";
import { onApply } from "../../../components/form-container/OnApply";
import GoBackHeader from "../../../components/header/GoBackHeader";
import { handleSubmitWithCallback } from "../../../utils/operation/handleSubmitWithCallback";
import { theme } from "../../../Theme";
import { useDeviceInfo } from "../../../utils/component/useDeviceInfo";
import { VStack } from "../../../../components/ui";
import { AuthLayout } from "../layout";
import { getField } from "../../../utils/operation/getField";
import { useSelector } from "react-redux";
import { useDisplayToast } from "../../../components/form-container/ShowToast";
import { useNetwork } from "../../../../context/NetworkContext";
import { useSchemas } from "../../../../context/SchemaProvider";
import FormContainer from "../../../components/form-container/FormContainer";
import { useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const VerifyScreen = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resendResponse, setResendResponse] = useState({});
  const defaultTimer = route?.params?.timer ?? 120; // default from route
  const goBackRoute = route?.params?.goBackRoute ?? "SignIn"; // default from route
  const [timer, setTimer] = useState(defaultTimer);
  const timerRef = useRef(null);
  const localization = useSelector((state) => state.localization.localization);
  const navigation = useNavigation();
  const { showToast } = useDisplayToast();
  const { resendState, loginVerifyState, signupState, forgetVerifyState } =
    useSchemas();

  const {
    control,
    handleSubmit,
    formState: { defaultValues = {}, errors },
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {},
  });

  const phoneNumberField = getField(
    signupState.schema.dashboardFormSchemaParameters,
    "phoneNumber",
  );
  const { isOnline } = useNetwork();
  const { [phoneNumberField]: phoneNumber, schemaActionName } =
    route.params || {}; // if passed from previous screen
  const { os } = useDeviceInfo();

  // Load timer ONCE
  useEffect(() => {
    let isMounted = true;

    const loadTimerFromStorage = async () => {
      try {
        const saved = await AsyncStorage.getItem("verify_timer");

        if (isMounted) {
          if (saved !== null) {
            setTimer(parseInt(saved, 10));
          } else {
            setTimer(defaultTimer);
            await AsyncStorage.setItem("verify_timer", defaultTimer.toString());
          }
        }
      } catch (e) {
        console.log("Timer load error:", e);
      }
    };

    loadTimerFromStorage();

    return () => {
      isMounted = false;
    };
  }, [defaultTimer]);

  // Start countdown AFTER the timer has been loaded
  useEffect(() => {
    if (timer === null) return; // prevent running before load

    timerRef.current && clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          AsyncStorage.setItem("verify_timer", defaultTimer.toString());
          return 0;
        }

        const newValue = prev - 1;
        AsyncStorage.setItem("verify_timer", newValue.toString());
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timer]); // ❗ runs only if timer changes

  // When user presses RESEND
  const handleManualResend = async () => {
    await handleResend();
    clearInterval(timerRef.current);

    setTimer(defaultTimer);
    await AsyncStorage.setItem("verify_timer", defaultTimer.toString());

    // restart timer cleaner
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          AsyncStorage.setItem("verify_timer", defaultTimer.toString());
          return 0;
        }
        const newValue = prev - 1;
        AsyncStorage.setItem("verify_timer", newValue.toString());
        return newValue;
      });
    }, 1000);
  };

  const handleOTPSubmit = async (data) => {
    if (data[loginVerifyState.schema.idField].length === 6) {
      const getLoginAction =
        loginVerifyState.actions &&
        loginVerifyState.actions.find(
          (action) => action.dashboardFormActionMethodType === "Get",
        );
      const getForgetAction =
        forgetVerifyState.actions &&
        forgetVerifyState.actions.find(
          (action) => action.dashboardFormActionMethodType === "Get",
        );
      const getAction =
        schemaActionName === "login" ? getLoginAction : getForgetAction;


      const constants = {
        ...data,
        ...route.params,
        ...resendResponse,
      };
      setLoading(true);

      try {
        const request = await onApply(
          {},
          null,
          true,
          getAction,
          loginVerifyState.schema.projectProxyRoute,
          false,
          constants,
        );
        setResult(request);

        if (request.data === true && request.success === true) {
          navigation.navigate("SignIn"); // or any other screen
        } else {
          showToast(
            localization.verify.otpToast.title,
            localization.verify.otpToast.des,
          );
        }
      } catch (error) {
        console.error("API call failed:", error);
        // Optionally, handle the error here (e.g., show a notification)
      } finally {
        // Enable the button after the API call
        setLoading(false);
      }
    } else {
      showToast(
        localization.verify.otpToast.title,
        localization.verify.otpToast.des,
      );
    }
  };
  const handleResend = async () => {
    const postAction =
      resendState.actions &&
      resendState.actions.find(
        (action) => action.dashboardFormActionMethodType === "Post",
      );
    await handleSubmitWithCallback({
      data: { ...route.params },
      setDisable: setLoading,
      action: postAction,
      proxyRoute: loginVerifyState.schema.projectProxyRoute,
      setReq: setResult,
      isNew: true,
      onSuccess: (resultData) => {
        setResendResponse(resultData);
        // navigation.navigate("Verify", {
        //   ...data,
        //   ...resultData,
        //   VerifySchema: VerifySchema,
        // });
      },
    });
  };

  return (
    <AuthLayout>
      <VStack
        className={`max-w-[440px] w-full mt-2 ${
          os == "web" && "m-auto bg-body shadow-lg !h-fit px-6 py-3 rounded-lg"
        }`}
        space="md"
      >
        <View style={styles.container}>
          <GoBackHeader
            subTitle={null}
            title={null}
            specialAction={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                if (Platform.OS === "web") {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: goBackRoute }],
                  });
                } else {
                  navigation.navigate(goBackRoute);
                }
              }
            }}
          />
          <Text style={styles.title}>{localization.verify.headTitle}</Text>
          <Text style={styles.subtitle}>
            {localization.verify.headDescription} {phoneNumber}
          </Text>
          <FormContainer
            tableSchema={loginVerifyState.schema}
            row={{}}
            errorResult={errors}
            control={control}
          />

          {/* <Text
            style={styles.title}
            onPress={async () => {
              await handleResend();
            }}
            className="text-[#6200ee] mt-2"
          >
            {localization.verify.resend}
          </Text> */}
          <Text
            style={[styles.title, { color: "#6200ee", marginTop: 10 }]}
            onPress={async () => {
              await handleManualResend();
              // setTimer(defaultTimer); // reset when user manually resends
              // await AsyncStorage.setItem(
              //   "verify_timer",
              //   defaultTimer.toString()
              // );
            }}
          >
            {localization.verify.resend} ({timer}s)
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              // await handleOTPSubmit();
              await handleSubmit(handleOTPSubmit)();
            }}
            disabled={loading}
          >
            {!loading ? (
              <Text style={styles.buttonText}>
                {localization.verify.VerifyButton}
              </Text>
            ) : (
              <View className="flex-row items-center justify-center mx-auto">
                <ActivityIndicator
                  size="small"
                  className="text-body flex-row justify-center"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </VStack>
    </AuthLayout>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: theme.body,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
  },
  otpContainer: {
    width: "80%",
    height: 80,
    alignSelf: "center",
  },
  underlineStyleBase: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 20,
    color: "#000",
  },
  underlineStyleHighLighted: {
    borderColor: "#6200ee",
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    marginTop: 40,
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
