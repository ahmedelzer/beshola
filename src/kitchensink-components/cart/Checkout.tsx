import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { useAuth } from "../../../context/auth";
import { useCart } from "../../../context/CartProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import { onApply } from "../../components/form-container/OnApply";
import LoadingButton from "../../utils/component/LoadingButton";
import PopupModal from "../../utils/component/PopupModal";
import PrivacyCheckbox from "../../utils/component/PrivacyCheckbox";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
import { getField } from "../../utils/operation/getField";
import Invoice, { InvoiceProvider } from "./InvoiceProvider";
import { GetFieldsItemTypes } from "../../utils/operation/GetFieldsItemTypes";
import { selectSelectedNode } from "../../reducers/LocationReducer";
import { useShopNode } from "../../../context/ShopNodeProvider";
export default function Checkout({
  postAction,
  row,
  proxyRoute,
  setOpenCheckout,
  openCheckout,
  setRow,
}) {
  const { checkoutState } = useSchemas();
  const [isPaid, setIsPaid] = useState(false);
  const [result, setResult] = useState(null);
  const [timeAllowed, setTimeAllowed] = useState(true);
  const [outURL, setOutURL] = useState(null);
  const { setNotifications } = useAuth();
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const callCount = useRef(0);

  const localization = useSelector((state) => state.localization.localization);
  const fieldsType = GetFieldsItemTypes(checkoutState.schema);
  const selectedTab = useSelector((state) => state.location.selectedTab);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation,
  );
  const { selectedNode } = useShopNode();
  const orderStatus = useSelector((state) => state.location.orderStatus);
  const { cartState, cartFieldsType } = useCart();
  const {
    rows: cartRows,
    totalCount: cartTotalCount,
    loading: cartLoading,
  } = cartState;
  const paymentRow = useSelector((state) => state.payment.paymentRow);
  const creditField = getField(
    checkoutState.schema.dashboardFormSchemaParameters,
    "inputWithLabel",
    false,
  );

  const pointsField = getField(
    checkoutState.schema.dashboardFormSchemaParameters,
    "additionalInputWithLabel",
    false,
  );
  const displayLookupParamAddress =
    checkoutState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayAddress",
    );
  const displayLookupParamNode =
    checkoutState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayNode",
    )?.parameterField;
  const params = checkoutState.schema?.dashboardFormSchemaParameters ?? [];
  const cartInfoFieldsType = {
    netPayAmount: getField(params, "netPayAmount", false),
  };
  const parameters = checkoutState.schema?.dashboardFormSchemaParameters ?? [];
  const paymentMethodsFieldsType = {
    // paymentMethod: getField(parameters, "checkList"),
    name: getField(parameters, "text"),
    idField: getField(parameters, "paymentMethodID"),
    dataSourceName: checkoutState.schema.dataSourceName,
  };
  const usingCredits = parseFloat(row[creditField.parameterField]) || 0;
  const usingPoints =
    covertPointsToCredits(parseFloat(row[pointsField.parameterField])) || 0;
  const requiredAmount = row[cartInfoFieldsType.netPayAmount?.parameterField];

  // Helper: Get formatted address
  const getAddress = () => {
    if (!selectedLocation) return localization.Hum_screens.checkout.noAddress;
    return `${selectedLocation[displayLookupParamAddress.parameterField]}`;
  };
  const handleUrlChange = (url) => {
    try {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      const paymentStatus = params.get("paymentStatus");

      if (paymentStatus === "true") {
        setIsPaid(true);

        setOpenCheckout(false);
      }
    } catch (err) {
      console.warn("Invalid URL:", err);
    }
  };

  const handleCheckoutClick = async () => {
    // if (callCount.current >= 2 || isPaid) {
    //   // setOpenCheckout(false);
    //   setNotifications([
    //     {
    //       mess: localization.Hum_screens.orders.notify.orderAddedError,
    //       status: "error",
    //     },
    //   ]);
    //   return false;
    // }
    if (orderStatus === "closed") {
      setNotifications([
        {
          mess: localization.Hum_screens.home.notify.branchClosed,
          status: "error",
        },
      ]);
      return; // stop cart update if closed
    }

    if (orderStatus === "nearClosed") {
      setNotifications([
        {
          mess: localization.Hum_screens.home.notify.branchNearClosed,
          status: "warning",
        },
      ]);
    }

    callCount.current += 1;
    setLoading(true);
    const res = await onApply(
      { ...row, ...paymentRow, isPaid: false },
      null,
      true,
      postAction,
      proxyRoute,
      null,
      row,
    );

    setResult(res);

    if (res?.data?.isDone === true) {
      setIsPaid(true);
      setNotifications([
        {
          mess: localization.Hum_screens.orders.notify.orderAdded,
          status: "success",
        },
      ]);
      // setOpenCheckout(false);
      return true;
    }

    const newTime = res?.data?.newCartItemsAddedTime;
    // if (newTime) {
    //   const now = new Date();
    //   const begin = new Date(newTime);
    //   const limitMinutes = 10;
    //   const end = new Date(begin.getTime() + limitMinutes * 60 * 1000);

    //   if (now >= begin && now <= end) {
    //     setTimeAllowed(true);
    //   } else if (res?.data?.isDone === false) {
    //     setTimeAllowed(false);
    //     // setOpenCheckout(false);
    //     setNotifications([
    //       {
    //         mess: localization.Hum_screens.orders.notify.orderAdded,
    //         status: "success",
    //       },
    //     ]);
    //     return true;
    //   }
    // }

    if (res?.data?.validationLink) {
      setOutURL(res?.data?.validationLink);
      return false;
    }
    setLoading(false);
  };

  const onPayPress = () => {
    setIsPaid(true);

    // setOpenCheckout(false);
  };

  // if (!timeAllowed) {
  //   return (
  //     <View className="p-4">
  //       <Text className="text-red-600 text-center font-semibold">
  //         {localization.checkout.checkoutExpired}
  //       </Text>
  //     </View>
  //   );
  // }
  const logQueryParams = (url) => {
    // try {
    const iframe = document?.querySelector("iframe");
    console.log(iframe.src);
    // } catch (error) {
    //   console.warn("Failed to parse URL:", error);
    // }
  };
  useEffect(() => {
    if (cartRows.length === 0) {
      setOutURL(null);
      setLoading(false);
      setOpenCheckout(false);
      setRow({});
    }
  }, [cartRows]);
  return (
    <PopupModal
      isOpen={openCheckout}
      haveFooter={true}
      footer={
        <>
          {!outURL && (
            <LoadingButton
              buttonText={localization.checkout.confirmAndPay}
              loading={loading}
              onPress={async () => {
                const runAction = await handleCheckoutClick();
                //!make here the content scroll down to the last item
                // flatListRef.current?.scrollToEnd({ animated: true });
                // setOpenCheckout(runAction);
              }}
              className="!bg-green-600 mt-5 py-3 px-5 rounded-xl"
            />
          )}
        </>
      }
      onClose={() => {
        setOutURL(null);
        setLoading(false);
        setOpenCheckout(false);
      }}
      onSubmit={() => {}}
      control={{}}
      isFormModal={false}
      headerTitle={localization.checkout.invoiceSummary}
    >
      {!outURL ? (
        <InvoiceProvider value={{}}>
          <Invoice>
            <Invoice.BranchAndAddress
              nodeFieldName={displayLookupParamNode}
              getAddress={selectedTab === 0 ? false : getAddress}
              selectedNode={selectedNode}
            />
            <View className="my-2">
              <PrivacyCheckbox
                row={row}
                setRow={() => {}}
                fastWayState={checkoutState}
              />
            </View>

            <FlatList
              data={cartRows}
              keyExtractor={(item) => item[fieldsType.idField]}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center mb-3">
                  <View className="pe-2" style={{ direction: "inherit" }}>
                    <Text className="font-medium">{item[fieldsType.text]}</Text>
                    <Text className="text-sm text-primary-custom">
                      {item[fieldsType.description]}
                    </Text>
                    <Text className="text-sm" style={{ direction: "inherit" }}>
                      {localization.checkout.quantity}:{" "}
                      {item[fieldsType.cardAction]}
                    </Text>
                  </View>
                  <View className="items-end">
                    {item[fieldsType.discount] > 0 && (
                      <Text className="text-sm line-through text-red-400">
                        {item[fieldsType.price].toFixed(2)}
                        {localization.menu.currency}{" "}
                      </Text>
                    )}
                    {item[fieldsType.priceAfterDiscount] >= 0 && (
                      <Text className="text-base font-semibold text-green-600">
                        {item[fieldsType.priceAfterDiscount].toFixed(2)}
                        {localization.menu.currency}{" "}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />
            <View className="mt-6 space-y-2">
              <View className="flex-row items-center space-x-2">
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  size={20}
                  color="#6b7280"
                />
                <Text className="text-lg font-bold text-gray-800">
                  {localization.checkout.summary}
                </Text>
              </View>
            </View>
            <Invoice.UsingPointsAndCredits
              creditField={creditField}
              pointsField={pointsField}
              row={row}
              usingCredits={usingCredits}
              usingPoints={usingPoints}
            />
            {Object.keys(paymentRow).length > 0 && (
              <Invoice.PaymentRow
                flatListRef={flatListRef}
                paymentMethodsFieldsType={paymentMethodsFieldsType}
                paymentRow={paymentRow}
              />
            )}
            <Invoice.RequiredAmount requiredAmount={requiredAmount} />
          </Invoice>
        </InvoiceProvider>
      ) : (
        <View style={{ flex: 1 }}>
          {outURL ? (
            Platform.OS === "web" ? (
              <iframe
                src={outURL}
                width="100%"
                height="600"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={(e) => {
                  try {
                    const frameUrl = document?.querySelector("iframe");
                    if (frameUrl) {
                      console.log("Redirected to (iframe):", frameUrl);
                      handleUrlChange(frameUrl);
                      logQueryParams(frameUrl); // Log query params for iframe
                    }
                  } catch {
                    console.warn(
                      "Unable to access iframe URL due to cross-origin.",
                    );
                  }
                }}
              />
            ) : (
              <WebView
                source={{ uri: outURL }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
              />
            )
          ) : null}
        </View>
      )}
    </PopupModal>
  );
}
