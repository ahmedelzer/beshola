import {
  default as React,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { useNetwork } from "../../../context/NetworkContext";
import { useWS } from "../../../context/WSProvider";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import { getField } from "../../utils/operation/getField";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { createRowCache } from "../Pagination/createRowCache";
import { getRemoteRows } from "../Pagination/getRemoteRows";
import { initialState, VIRTUAL_PAGE_SIZE } from "../Pagination/initialState";
import reducer from "../Pagination/reducer";
import SuggestCardSkeleton from "../skeletonLoading/SuggestCardSkeleton";
import { RenderSuggestCards } from "./RenderSuggestCards";
import { useSchemas } from "../../../context/SchemaProvider";
import { useShopNode } from "../../../context/ShopNodeProvider";
import { getItemsLoadingCount } from "../../utils/operation/getItemsLoadingCount";
import FavoriteMenuItemsSchema from "../../Schemas/MenuSchema/FavoriteMenuItemsSchema.json";
import { Heading } from "../../../components/ui";
import { isRTL } from "../../utils/operation/isRTL";
export default function SuggestCardContainer({
  row = {},
  schemaActions,
  suggestContainerType = 1,
  shownNodeMenuItemIDs = [],
  header = "",
}) {

  const { status, isOnline } = useNetwork();
  const [WS_Connected, setWS_Connected] = useState(false);
  const [currentSkip, setCurrentSkip] = useState(1);
  const [newItems, setNewItems] = useState(1);
  const { _wsMessageSuggest, setWSMessageSuggest } = useWS();
  const { suggestCardState } = useSchemas();
  const [suggestState, suggestReducerDispatch] = useReducer(
    reducer,
    initialState(4000, suggestCardState.schema.idField),
  );
  const itemsLoadingCount = useMemo(() => getItemsLoadingCount(), []);

  const parameters =
    suggestCardState.schema?.dashboardFormSchemaParameters ?? [];
  const getSuggestAction =
    schemaActions &&
    schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );
  const reduxSelectedLocation = useSelector(
    (state: any) => state.location?.selectedLocation,
  );
  const reduxSelectedNode = useSelector(
    (state: any) => state.location?.selectedNode,
  );

  const [selectedLocation, setSelectedLocation] = useState(
    reduxSelectedLocation || null,
  );
  const { selectedNode } = useShopNode();
  const suggestFieldsType = {
    imageView: getField(parameters, "menuItemImage"),
    text: getField(parameters, "menuItemName"),
    description: getField(parameters, "menuItemDescription"),
    price: getField(parameters, "price"),
    isAvailable: getField(parameters, "isAvailable"),
    discount: getField(parameters, "discount"),
    priceAfterDiscount: getField(parameters, "priceAfterDiscount"),
    rewardPoints: getField(parameters, "rewardPoints"),
    idField: suggestCardState.schema.idField,
    dataSourceName: suggestCardState.schema.dataSourceName,
    cardAction: getField(parameters, "cardAction"),
    isFav: getField(parameters, "isFav"),
  };

  const {
    rows: suggestRows,
    totalCount: suggestTotalCount,
    loading: suggestLoading,
  } = suggestState;

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (
      isScrolledToBottom &&
      suggestRows.length < suggestTotalCount &&
      !suggestLoading
    ) {
      getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, suggestReducerDispatch); //todo change dispatch by reducerDispatch
      setCurrentSkip(currentSkip + 1);
    }
  };

  const suggestDataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      projectRout: suggestCardState.schema.projectProxyRoute,
      ...row,
      shownNodeMenuItemIDs: shownNodeMenuItemIDs.join(","),
    });
  };

  useEffect(() => {
    //if (!selectedNode) return;
    setWS_Connected(false);
  }, [selectedNode, isOnline]);
  // 🌐 Setup WebSocket connection on mount or WS_Connected change
  useEffect(() => {
    if (WS_Connected) return;
    let cleanup;
    ConnectToWS(
      setWSMessageSuggest,
      setWS_Connected,
      suggestFieldsType.dataSourceName,
    )
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch((e) => {});
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [WS_Connected]);

  // 🧠 Reducer callback to update rows
  const callbackReducerUpdate = async (ws_updatedRows) => {
    // await suggestReducerDispatch({
    //   type: "WS_OPE_ROW",
    //   payload: {
    //     rows: ws_updatedRows?.rows,
    //     totalCount: ws_updatedRows?.totalCount,
    //   },
    // });
  };

  // 📨 React to WebSocket messages only when valid
  useEffect(() => {
    if (!_wsMessageSuggest) return;
    const _handleWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageSuggest,
      fieldsType: suggestFieldsType,
      rows: suggestRows,
      totalCount: suggestTotalCount,
      callbackReducerUpdate,
    });

    _handleWSMessage.process();

    //setWSMessageMenuItem(_wsMessageMenuItem);
  }, [_wsMessageSuggest]);

  const selectedNodeRef = useRef(selectedNode);
  useEffect(() => {
    console.log("suggestReducerDispatch");
    if (selectedNodeRef.current !== selectedNode) {
      selectedNodeRef.current = selectedNode;
      suggestReducerDispatch({
        type: "RESET_SERVICE_LIST",
        payload: { lastQuery: "" },
      });
      setNewItems(newItems + 1);
    }
  }, [
    selectedNode,
    shownNodeMenuItemIDs,
    suggestDataSourceAPI,
    getSuggestAction,
    suggestReducerDispatch,
    suggestState,
  ]);

  useEffect(() => {
    prepareLoad({
      state: suggestState,
      dataSourceAPI: suggestDataSourceAPI,
      getAction: getSuggestAction,
      cache: createRowCache(4000),
      reducerDispatch: suggestReducerDispatch,
      abortController: false,
      reRequest: true,
    });
  }, [newItems]);
  return suggestTotalCount > 0 ? (
    <View className="flex-col">
      <Heading className="text-text font-bold text-xl">{header}</Heading>
      <ScrollView
        horizontal
        className="mt-2"
        inverted={isRTL()} // ✅ RTL scroll on mobile
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 12,
          alignItems: "flex-start",
        }}
      >
        <RenderSuggestCards
          items={suggestRows}
          schemaActions={schemaActions}
          suggestContainerType={suggestContainerType}
          suggestFieldsType={suggestFieldsType}
        />
        {suggestLoading && (
          <>
            {Array.from({ length: itemsLoadingCount }).map((_, i) => (
              <SkeletonWrapper
                key={i}
                isLoading={suggestLoading}
                SkeletonComponent={SuggestCardSkeleton} // optional, if you have a custom skeleton
                // skeletonProps={{ width: "100%", height: 200 }}
              ></SkeletonWrapper>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  ) : null;
}
