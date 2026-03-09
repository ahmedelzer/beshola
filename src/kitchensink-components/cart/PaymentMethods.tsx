import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Animated, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RadioParameter } from "../../components/form-container";
import { onApply } from "../../components/form-container/OnApply";
import { updatePayment } from "../../reducers/PaymentReducer";
import { theme } from "../../Theme";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import SelectComponent from "../../utils/component/SelectComponent";
import { getField } from "../../utils/operation/getField";
import LoadingScreen from "../loading/LoadingScreen";
import { Chase } from "react-native-animated-spinkit";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "../../../components/ui";
import { useSchemas } from "../../../context/SchemaProvider";
//! check from the index and get the row and the set ID then disply the select component
export default function PaymentMethods({ paymentMethods, isLoading, row }) {
  const [loading, setLoading] = useState(false);
  const { paymentMethodsState } = useSchemas();
  // const [loading, setLoading] = useState(false);
  const paymentRow = useSelector((state) => state.payment.paymentRow);

  const dispatch = useDispatch();
  const animation = useRef(new Animated.Value(0)).current;
  const localization = useSelector((state) => state.localization.localization);
  const parameters =
    paymentMethodsState?.schema?.dashboardFormSchemaParameters ?? [];

  const paymentMethodsFieldsType = {
    // paymentMethod: getField(parameters, "checkList"),
    name: getField(parameters, "text"),
    // isActive: getField(parameters, "radio"),
    idField: paymentMethodsState?.schema.idField,
    dataSourceName: paymentMethodsState?.schema.dataSourceName,
  };
  const postAction =
    paymentMethodsState?.actions &&
    paymentMethodsState?.actions?.find(
      (action) => action.dashboardFormActionMethodType === "Post",
    );

  const maxHeight = 150; // Adjust based on content size
  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });
  //set paymentMethod to init it if do not found
  useEffect(() => {
    const initPayment = async () => {
      if (Object.keys(paymentRow).length <= 0 && paymentMethods?.length > 0) {
        try {
          await dispatch(
            updatePayment({
              paymentRow: paymentMethods[0],
            }),
          );
          // }
        } catch (error) {
          console.error("onApply failed:", error);
        }
      }
    };
    initPayment();
  }, [paymentMethods]);
  //set paymentMethod when row change
  // useEffect(() => {
  //   const setPaymentWhenRowChange = async () => {
  //     try {
  //       const req = await onApply(
  //         {
  //           ...paymentRow,
  //           ...row,
  //           payAmount: 100,
  //         },
  //         null,
  //         true,
  //         postAction
  //       );
  //     } catch (error) {
  //       console.error("onApply failed:", error);
  //     }
  //   };
  //   setPaymentWhenRowChange();
  // }, [row]);
  // useEffect(() => {
  //   dispatch(
  //     updatePayment({ index: watch().payment, payment: paymentMethods[0] })
  //   );

  // }, []);
  const OnChange = async (methodID) => {
    const method = paymentMethods.find(
      (method) => method[paymentMethodsFieldsType.idField] === methodID,
    );
    if (paymentMethods.length > 0) {
      setLoading(true);
      // const req = await onApply(
      //   {
      //     ...method,
      //     ...row,
      //     payAmount: 100,
      //   },
      //   null,
      //   true,
      //   postAction
      // );
      // if (req.success == true && req.data == true) {
      await dispatch(
        updatePayment({
          paymentRow: method,
        }),
      );
      // }
      setLoading(false);
    }
  };
  return (
    <View className="mt-6 border border-border bg-body rounded-xl p-2 w-full">
      <CollapsibleSection
        title={
          paymentMethodsState?.schema.dashboardFormSchemaInfoDTOView
            .schemaHeader
        }
        icon={null}
        setheader={true}
        iconColor={theme.body}
        textColor={theme.body}
        buttonClassName={
          "rounded-xl p-2 !bg-accent text-lg font-bold text-body"
        }
      >
        {isLoading ? (
          <LoadingScreen LoadingComponent={<Chase size={40} />} />
        ) : (
          <>
            {" "}
            <View>
              <RadioGroup
                value={paymentRow?.[paymentMethodsFieldsType.idField]}
                onChange={(newValue) => {
                  OnChange(newValue);
                  // Update both local state and form state when radio value changes
                  // setLocalValue(newValue);
                }}
                isDisabled={loading}
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
              >
                {/* Yes Option */}
                {paymentMethods?.map((method, index) => (
                  <Radio
                    value={method[paymentMethodsFieldsType.idField]}
                    key={index}
                  >
                    <RadioIndicator>
                      <RadioIcon
                        as={() => (
                          <MaterialIcons
                            name="radio-button-checked"
                            size={20}
                            color="black"
                          />
                        )}
                      />
                    </RadioIndicator>
                    <RadioLabel>
                      {method[paymentMethodsFieldsType.idField]
                        ? method[paymentMethodsFieldsType.name]
                        : localization[method[paymentMethodsFieldsType.name]]}
                    </RadioLabel>
                  </Radio>
                ))}
              </RadioGroup>
            </View>
            {/* {paymentValueIndex === "1" && (
              <View className="mt-4">
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity
                    className="p-2 rounded-lg me-2 bg-accent items-center justify-center"
                    // onPress={() => setIsModalVisible(true)}
                  >
                    <Entypo name="plus" size={20} color="white" />
                  </TouchableOpacity>
                  <SelectComponent
                    idField={"paymentMethodID"}
                    labelField={"paymentMethodName"}
                    mapData={paymentMethods}
                    onValueChange={(selected) => {
                      dispatch(
                        updatePayment({
                          index: control._formValues.payment,
                          paymentRow: selected,
                        })
                      );
                    }}
                    selectedValue={paymentRow || paymentMethods[0].name}
                    valueField="name"
                  />
                </View>
              </View>
            )} */}
          </>
        )}
        {/* Animated sliding container */}
        {/* <Animated.View
          style={{ height: heightInterpolate, overflow: "hidden" }}
        > */}

        {/* </Animated.View> */}
      </CollapsibleSection>
    </View>
  );
}
