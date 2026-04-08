// SearchContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import reducer from "../src/components/Pagination/reducer";
import {
  initialState,
  OFF_SET_SCROLL,
  VIRTUAL_PAGE_SIZE,
} from "../src/components/Pagination/initialState";

import { ConnectToWS } from "../src/utils/WS/ConnectToWS";
import { useNetwork } from "./NetworkContext";
import { useWS } from "./WSProvider";
import { WSMessageHandler } from "../src/utils/WS/handleWSMessage";

import { buildApiUrl } from "../components/hooks/APIsFunctions/BuildApiUrl";
import { useSelector } from "react-redux";

import { prepareLoad } from "../src/utils/operation/loadHelpers";
import { createRowCache } from "../src/components/Pagination/createRowCache";
import { getRemoteRows } from "../src/components/Pagination/getRemoteRows";

import AssetsSchema from "../src/Schemas/MenuSchema/AssetsSchema.json";
import AssetsSchemaActions from "../src/Schemas/MenuSchema/AssetsSchemaActions.json";

import { useShopNode } from "./ShopNodeProvider";
import { useTab } from "./TabsProvider";
import { useManageRealtimeDataWithWS } from "../src/utils/WS/useManageRealtimeDataWithWS";

export const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const { activeTab } = useTab();
  const filtersMap = new Map([]);
  const [menuItemRow, setMenuItemRow] = useState({ ...activeTab });

  const [WS_Connected, setWS_Connected] = useState(false);
  const previousRowRef = useRef({});
  const previousControllerRef = useRef(null);

  const { _wsMessageMenuItem, setWSMessageMenuItem } = useWS();

  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);

  const { selectedNode } = useShopNode();
  const selectedNodeRef = useRef(selectedNode);
  const activeTabRef = useRef(activeTab);

  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, AssetsSchema.idField),
  );

  const [currentSkip, setCurrentSkip] = useState(0);

  const { rows, totalCount, loading } = state;

  const {
    status: { isConnected: isOnline },
  } = useNetwork();

  const cache = createRowCache(VIRTUAL_PAGE_SIZE);

  const getAction =
    AssetsSchemaActions &&
    AssetsSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const dataSourceAPI = (query, skip, take) => {
    const pageIndex = Math.floor(skip / take) + 1;
    return buildApiUrl(query, {
      pageIndex,
      pageSize: take,
      ...menuItemRow,
      ...activeTab,
    });
  };

  /**
   * Reset when selected node changes
   */
  useEffect(() => {
    if (
      selectedNodeRef.current !== selectedNode ||
      activeTabRef.current !== activeTab
    ) {
      selectedNodeRef.current = selectedNode;
      activeTabRef.current = activeTab;

      reducerDispatch({
        type: "RESET_SERVICE_LIST",
        payload: { lastQuery: "" },
      });

      setCurrentSkip((prev) => prev + 1);
    }
  }, [selectedNode, activeTab]);

  /**
   * Load data
   */
  useEffect(() => {
    const controller = new AbortController();
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
      abortController: controller,
    });

    previousControllerRef.current = controller;

    return () => controller.abort();
  }, [menuItemRow, currentSkip]);
  useManageRealtimeDataWithWS({
    wsMessage: _wsMessageMenuItem,
    setWSMessage: setWSMessageMenuItem,
    fieldsType,
    rows,
    totalCount,
    reducerDispatch,
    deps: [selectedNode],
  });

  /**
   * Detect filter change
   */
  useEffect(() => {
    if (!menuItemRow) return;

    if (JSON.stringify(previousRowRef.current) === JSON.stringify(menuItemRow))
      return;

    const prevRow = previousRowRef.current || {};

    const changedProps = Object.keys(menuItemRow).filter(
      (key) => menuItemRow[key] !== prevRow[key],
    );

    const changedKey = changedProps.length === 1 ? changedProps[0] : null;

    if (
      changedKey &&
      previousControllerRef.current &&
      Object.keys(previousRowRef.current).length > 0
    ) {
      previousControllerRef.current.abort();
    }

    previousRowRef.current = menuItemRow;

    reducerDispatch({ type: "RESET_SERVICE_LIST" });
    setCurrentSkip(0);
  }, [menuItemRow]);

  /**
   * Load more rows
   */
  const onLoadMore = () => {
    if (loading || rows.length >= totalCount) return;

    getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE, reducerDispatch);

    setCurrentSkip((prev) => prev + VIRTUAL_PAGE_SIZE);
  };

  /**
   * Scroll pagination
   */
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - OFF_SET_SCROLL;

    if (!isScrolledToBottom || loading || rows.length >= totalCount) return;

    const remaining = totalCount - rows.length;
    if (remaining <= 0) return;

    const take = Math.min(VIRTUAL_PAGE_SIZE * 2, remaining);

    getRemoteRows(rows.length, take, reducerDispatch);

    setCurrentSkip((prev) => prev + take);
  };

  return (
    <SearchContext.Provider
      value={{
        menuItemRow,
        setMenuItemRow,
        state,
        reducerDispatch,
        handleScroll,
        onLoadMore,
        filtersMap,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
