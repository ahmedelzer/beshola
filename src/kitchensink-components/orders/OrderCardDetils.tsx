import { Entypo } from "@expo/vector-icons";
import { default as React, useEffect, useReducer, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import OrderItemsSchemaActions from "../../Schemas/OrdersSchema/OrderItemsSchemaActions.json";
import { createRowCache } from "../../components/Pagination/createRowCache";
import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import ImageCardActions from "../../components/cards/ImageCardActions";
import OrderCardItemSkeleton from "../../components/skeletonLoading/OrderCardItemSkeleton";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
import { getField } from "../../utils/operation/getField";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import Invoice, { InvoiceProvider } from "../cart/InvoiceProvider";
import InvoiceSummary from "../cart/InvoiceSummary";
import { DisplayItem } from "../profile/PurchaseCardDetils";
import LocationButton from "../../utils/component/LocationButton";
export default function OrderCardDetils({ order, ordersFieldsType, idField }) {
  const localization = useSelector((state) => state.localization.localization);
  const notify = localization.Hum_screens.orders.notify;
  const getAddress = () => {
    return `${order[ordersFieldsType.displayAddress.parameterField]}`;
  };

  const usingCredits =
    parseFloat(order[ordersFieldsType.creditField.parameterField]) || 0;
  const usingPoints =
    covertPointsToCredits(
      parseFloat(order[ordersFieldsType.pointsField.parameterField]),
    ) || 0;
  const requiredAmount = order[ordersFieldsType.netPayAmount.parameterField];
  const paymentMethodsFieldsType = {
    name: ordersFieldsType.paymentMethodName,
    idField: ordersFieldsType.paymentMethodID,
  };
  const fieldsType = useSelector((state) => state.menuItem.fieldsType); //!make new schema
  //get items
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, idField),
  );
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      [ordersFieldsType.idField]: order[ordersFieldsType.idField],

      // ...row,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    OrderItemsSchemaActions &&
    OrderItemsSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const { rows, skip, totalCount, loading } = state;
  useEffect(() => {
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
    });
    // Call LoadData with the controller
  });
  return (
    <InvoiceProvider value={{}}>
      <Invoice>
        <View className="mb-4">
          <View className="flex-row justify-content-between items-center gap-2">
            {order?.[ordersFieldsType.nodeLatitudePoint] && (
              <View className="w-[10%]" style={{ top: 12 }}>
                <LocationButton
                  latitude={order[ordersFieldsType.nodeLatitudePoint]}
                  longitude={order[ordersFieldsType.nodeLongitudePoint]}
                />
              </View>
            )}

            <View className="w-[70%]">
              <Invoice.BranchAndAddress
                nodeFieldName={ordersFieldsType.displayNode}
                getAddress={
                  order[ordersFieldsType.orderTypeIndex] == 0
                    ? false
                    : getAddress
                }
                selectedNode={order}
              />
            </View>
          </View>
        </View>
        {loading && (
          <View>
            <SkeletonWrapper
              isLoading={loading}
              SkeletonComponent={OrderCardItemSkeleton} // optional, if you have a custom skeleton
              skeletonProps={{ width: "100%", height: 200, overFlow: "hidden" }}
            ></SkeletonWrapper>
          </View>
        )}
        <FlatList
          data={rows}
          keyExtractor={(item) => item[fieldsType.idField]}
          renderItem={({ item }) => (
            <DisplayItem fieldsType={fieldsType} item={item} />
          )}
        />

        <InvoiceSummary
          summaryRow={{}}
          setSummaryRow={() => {}}
          InvoiceSummaryInfo={order}
          schemaFieldsTypes={ordersFieldsType}
          isExpanded={false}
        />
        <Invoice.UsingPointsAndCredits
          creditField={ordersFieldsType.creditField}
          pointsField={ordersFieldsType.pointsField}
          row={order}
          usingCredits={usingCredits}
          usingPoints={usingPoints}
        />
        <Invoice.PaymentRow
          flatListRef={{}}
          paymentMethodsFieldsType={paymentMethodsFieldsType}
          paymentRow={order}
        />
        <Invoice.RequiredAmount requiredAmount={requiredAmount} />
      </Invoice>
    </InvoiceProvider>
  );
}
