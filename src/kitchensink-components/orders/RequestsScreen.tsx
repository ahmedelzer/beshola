import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { VStack } from "../../../components/ui";
import { useNetwork } from "../../../context/NetworkContext";
import { useSchemas } from "../../../context/SchemaProvider";
import { useWS } from "../../../context/WSProvider";
import OrderCard from "../../components/cards/OrderCard";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { getRemoteRows } from "../../components/Pagination/getRemoteRows";
import {
  initialState,
  OFF_SET_SCROLL,
  VIRTUAL_PAGE_SIZE,
} from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import OrderCardSkeleton from "../../components/skeletonLoading/OrderCardSkeleton";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import { getItemsLoadingCount } from "../../utils/operation/getItemsLoadingCount";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import CompanyCardsView from "../../components/company-components/CompanyCardsView";
import CompanyCardsFlatList from "../../components/company-components/CompanyCardsVirtualized";
import { useCart } from "../../../context/CartProvider";
import { useSearch } from "../../../context/SearchProvider";
import RequestCard from "../../components/cards/RequestCard";
import { initCompanyRows } from "../../components/company-components/tabsData";
import { usePreloadList } from "../../components/Pagination/usePreloadList";
import { useManageRealtimeDataWithWS } from "../../utils/WS/useManageRealtimeDataWithWS";
export default function RequestsScreen({}) {
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  const itemsLoadingCount = useMemo(() => getItemsLoadingCount(), []);

  const { orderState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  const { _wsMessageRequests, setWSMessageRequests } = useWS();
  const [WS_Connected, setWS_Connected] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [reqError, setReqError] = useState(null);
  const [disable, setDisable] = useState(null);
  const [row, setRow] = useState({});
  const [col, setCol] = useState({});
  const {
    rows,
    totalCount,
    loading,
    handleScroll,
    dispatch: reducerDispatch,
  } = usePreloadList({
    idField: orderState.schema?.idField,
    schemaActions: orderState.actions,
    row: {
      ...row,
    },
    deps: [],
  });
  // const [state, reducerDispatch] = useReducer(
  //   reducer,
  //   initialState(VIRTUAL_PAGE_SIZE, orderState.schema[0].idField),
  // );
  // const [currentSkip, setCurrentSkip] = useState(1);
  // const dataSourceAPI = (query, skip, take) => {
  //   return buildApiUrl(query, {
  //     pageIndex: skip + 1,
  //     pageSize: take,

  //     ...row,
  //   });
  // };
  // const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  // const getAction =
  //   orderState.actions &&
  //   orderState.actions.find(
  //     (action) => action.dashboardFormActionMethodType === "Get",
  //   );

  // const { rows, skip, totalCount, loading } = state;
  // useEffect(() => {
  //   prepareLoad({
  //     state,
  //     dataSourceAPI,
  //     getAction,
  //     cache,
  //     reducerDispatch,
  //   });

  //   // Call LoadData with the controller
  // }, [currentSkip]);
  //WS
  const fieldsType = {
    idField: orderState.schema.idField,
    dataSourceName: orderState.schema.dataSourceName,
  };
  useManageRealtimeDataWithWS({
    wsMessage: _wsMessageRequests,
    setWSMessage: setWSMessageRequests,
    fieldsType,
    rows,
    totalCount,
    reducerDispatch,
    deps: [],
  });

  // const handleScroll = (event) => {
  //   const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

  //   const isScrolledToBottom =
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - OFF_SET_SCROLL;

  //   if (isScrolledToBottom && rows.length < totalCount && !loading) {
  //     getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, reducerDispatch); //todo change dispatch by reducerDispatch
  //     setCurrentSkip(currentSkip + 1);
  //   }
  // };
  //
  const { cartState, cartFieldsType } = useCart();
  const { menuItemsState } = useSchemas();

  const { menustate } = useSearch();
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
        marginTop: 10,
      }}
      className="!overflow-scroll"
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {!loading && rows?.length === 0 && (
        <View className="w-full flex-row justify-center items-center">
          <Text className="text-xl text-accent font-bold">
            {localization.Hum_screens.orders.noOrders}
          </Text>
        </View>
      )}
      <CompanyCardsFlatList
        fieldsType={fieldsType}
        cartState={cartState}
        menuItemsState={menuItemsState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        rows={rows}
        CardComponent={RequestCard}
      />
      <RenderLoadingItems
        SkeletonComponent={OrderCardSkeleton}
        loading={loading}
        classNameContainer={
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3"
        }
        rows={rows}
      />
    </ScrollView>
  );
}
