import JsBarcode from "jsbarcode";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import { useAuth } from "../../../context/auth";
import AddressLocationSchema from "../../Schemas/AddressLocation/AddressLocation.json";
import NearestBranches from "../../Schemas/AddressLocation/NearestBranches.json";
import PaymentMethodsSchema from "../../Schemas/MenuSchema/PaymentMethods.json";
import { theme } from "../../Theme";
import StepHeader from "../../components/splash/StepHeader";
import OrderCardDetils from "../../kitchensink-components/orders/OrderCardDetils";
import DetilsButtonCollops from "../../utils/component/DetilsButtonCollops";
import WarningPop from "../../utils/component/WarningPop";
import { RenderDeleteAction } from "../../utils/component/renderDeleteAction";
import { setdateTime } from "../../utils/operation/dateutilies";
import { getField } from "../../utils/operation/getField";
import { isRTL } from "../../utils/operation/isRTL";
import BarcodeComponent from "../../utils/component/BarcodeComponent";

export default function OrderCard({ order, schemas }) {
  const localization = useSelector((state) => state.localization.localization);
  const { orderState } = useSchemas();
  const subSchemas = schemas.filter((schema, index) => index !== 0);
  const parametersFirstSchema = schemas[0].dashboardFormSchemaParameters;
  const parametersSecondSchema = schemas[1].dashboardFormSchemaParameters;
  const [child, setChild] = useState(null);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const { setNotifications } = useAuth();
  const selectedNode = useSelector(
    (state) => state.location.selectedNodePickup,
  );
  const selectedTab = useSelector((state) => state.location.selectedTab);
  const notify = localization.Hum_screens.orders.notify;
  const displayLookupParamAddress =
    AddressLocationSchema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayLookup",
    );
  const displayLookupParamNode =
    NearestBranches.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayLookup",
    );
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation,
  );
  const getAddress = () => {
    if (selectedTab === 0)
      return localization.Hum_screens.orders.pickup || "Pickup";
    if (!selectedLocation) return localization.Hum_screens.checkout.noAddress;
    return `${selectedLocation[displayLookupParamAddress.lookupDisplayField]}`;
  };
  const ordersFieldsType = {
    orderType: getField(parametersFirstSchema, "orderType"),
    orderState: getField(parametersFirstSchema, "orderState"),
    details: getField(parametersFirstSchema, "detailsCell", false),
    invoiceNumber: getField(parametersFirstSchema, "invoiceNumber"),
    isPaid: getField(parametersFirstSchema, "isPaid"),
    requestedDatetime: getField(parametersFirstSchema, "datetime", false),

    totalAmount: getField(parametersSecondSchema, "totalAmount", false),
    otherFeesAmount: getField(parametersSecondSchema, "otherFeesAmount", false),
    invoiceItemsTaxAmount: getField(
      parametersSecondSchema,
      "invoiceItemsTaxAmount",
      false,
    ),
    invoiceTaxAmount: getField(
      parametersSecondSchema,
      "invoiceTaxAmount",
      false,
    ),
    totalFeesAmount: getField(parametersSecondSchema, "totalFeesAmount", false),
    feesAmount: getField(parametersSecondSchema, "feesAmount", false),
    netAmount: getField(parametersSecondSchema, "netAmount", false),
    invoiceItemsDiscountAmount: getField(
      parametersSecondSchema,
      "invoiceItemsDiscountAmount",
      false,
    ),
    invoiceDiscountAmount: getField(
      parametersSecondSchema,
      "invoiceDiscountAmount",
      false,
    ),
    totalDiscountAmount: getField(
      parametersSecondSchema,
      "totalDiscountAmount",
      false,
    ),
    totalTaxAmount: getField(parametersSecondSchema, "totalTaxAmount", false),
    totalShipmentsNeeded: getField(
      parametersSecondSchema,
      "totalShipmentsNeeded",
      false,
    ),
    shipmentFees: getField(parametersSecondSchema, "shipmentFees", false),
    otherFees: getField(parametersSecondSchema, "otherFees", false),
    creditField: getField(parametersSecondSchema, "accountCreditUsed", false),
    displayAddress: getField(parametersSecondSchema, "displayAddress", false),
    displayNode: getField(parametersSecondSchema, "displayNode"),
    orderTypeIndex: getField(parametersSecondSchema, "orderTypeIndex"),
    pointsField: getField(parametersSecondSchema, "loyaltyPointsUsed", false),
    nodeLongitudePoint: getField(parametersSecondSchema, "nodeLongitudePoint"),
    nodeLatitudePoint: getField(parametersSecondSchema, "nodeLatitudePoint"),
    idField: schemas[0].idField,
    netPayAmount: getField(parametersSecondSchema, "netPayAmount", false),
    paymentMethodID: getField(parametersSecondSchema, "paymentMethodID"),
    paymentMethodName: getField(parametersSecondSchema, "paymentMethodName"),

    dataSourceName: schemas[0].dataSourceName,
    proxyRoute: schemas[0].projectProxyRoute,
  };
  const parameters = PaymentMethodsSchema?.dashboardFormSchemaParameters ?? [];

  // Get the correct step labels based on orderType
  const getStepLabels = (orderType) => {
    const pickupSteps = localization.Hum_screens.orders.pickupSteps;
    const deliverySteps = localization.Hum_screens.orders.deliverySteps;
    return orderType === 0 ? pickupSteps : deliverySteps;
  };
  const labels = getStepLabels(order[ordersFieldsType.orderType]);
  const delAction =
    orderState.actions &&
    orderState.actions.find(
      (action) => action.dashboardFormActionMethodType === "Delete",
    );
  const removeCard = async () => {
    const req = true; //!only need edit delAction
    // await DeleteItem(
    //   order[ordersFieldsType.idField],
    //   true,
    //   delAction,
    //   ""
    // );
    if (req) {
      setNotifications([{ mess: notify.orderRemoved }]);
      setIsOpenAlert(false);
    } else {
      setNotifications([
        {
          mess: notify.orderRemovedError,
          status: "error",
        },
      ]);
    }
  };
  ///
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, "111425556", {
        format: "CODE128",
        width: 2,
        height: 80,
        displayValue: true,
      });
    }
  }, []);
  return (
    <View
      className="rounded-xl overflow-hidden !bg-error mb-4 shadow-md mx-1 !h-fit"
      style={{ backgroundColor: theme.error }}
    >
      <Swipeable
        renderRightActions={
          !isRTL()
            ? (progress, dragX) =>
                RenderDeleteAction(progress, dragX, () => setIsOpenAlert(true))
            : null
        }
        renderLeftActions={
          isRTL()
            ? (progress, dragX) =>
                RenderDeleteAction(progress, dragX, () => setIsOpenAlert(true))
            : null
        }
      >
        <View
          // key={order[ordersFieldsType.idField]}
          className="bg-body p-4 rounded-xl"
        >
          <BarcodeComponent
            value={order[ordersFieldsType.invoiceNumber]}
            chiled={
              <Text className="text-ls font-semibold mb-2">
                {localization.Hum_screens.orders.order} #
                {order[ordersFieldsType.invoiceNumber]}
              </Text>
            }
          />
          <Text style={styles.date} className="text-ls font-semibold">
            {setdateTime(
              order[ordersFieldsType?.requestedDatetime?.parameterField],
            )}
          </Text>

          <StepHeader
            currentPosition={order[ordersFieldsType.orderState]}
            labels={labels}
            customKey={`${order[ordersFieldsType.idField]}-${
              ordersFieldsType.orderState
            }-${order[ordersFieldsType.orderState]}`}
          />
          {child && child}
          <DetilsButtonCollops
            DetailsComponent={
              <OrderCardDetils
                idField={schemas[0].idField}
                order={order}
                ordersFieldsType={ordersFieldsType}
              />
            }
            child={child}
            setChild={setChild}
          />
          <WarningPop
            bodyText={localization.Hum_screens.orders.cancelConfirmationMessage}
            confirmText={localization.Hum_screens.orders.yes}
            handleClose={() => setIsOpenAlert(false)}
            handleConfirm={() => setIsOpenAlert(true)}
            headingText={
              localization.Hum_screens.orders.cancelConfirmationTitle
            }
            cancelText={localization.Hum_screens.orders.no}
            isOpen={isOpenAlert}
          />
          {ordersFieldsType.isPaid && order[ordersFieldsType.isPaid] && (
            <View
              key={`${order[ordersFieldsType.idField]}-${
                ordersFieldsType.isPaid
              }-${order[ordersFieldsType.isPaid]}`}
              style={{
                backgroundColor: theme.accentHover,
                paddingHorizontal: 30,
                paddingVertical: 4,
                top: 10,
                zIndex: 200,
                overflow: "hidden",
              }}
              className={`${
                isRTL() ? "-left-[20px] -rotate-45" : "-right-[20px] rotate-45"
              } absolute`}
            >
              <Text
                style={{ color: theme.body, fontWeight: "bold", fontSize: 12 }}
              >
                {localization.Hum_screens.orders.paid}
              </Text>
            </View>
          )}
        </View>
      </Swipeable>
    </View>
  );
}
const styles = StyleSheet.create({
  date: {
    textAlign: "center",
    textShadowRadius: 2,
  },
  container: {
    alignItems: "center",
    marginTop: 50,
  },
});
