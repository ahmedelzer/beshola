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

export const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [menuItemRow, setMenuItemRow] = useState({});
  const [WS_Connected, setWS_Connected] = useState(false);
  const previousRowRef = useRef({});
  const previousControllerRef = useRef(null);

  const { _wsMessageMenuItem, setWSMessageMenuItem } = useWS();

  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);

  const { selectedNode } = useShopNode();
  const selectedNodeRef = useRef(selectedNode);

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
    });
  };

  /**
   * Reset when selected node changes
   */
  useEffect(() => {
    if (selectedNodeRef.current !== selectedNode) {
      selectedNodeRef.current = selectedNode;

      reducerDispatch({
        type: "RESET_SERVICE_LIST",
        payload: { lastQuery: "" },
      });

      setCurrentSkip((prev) => prev + 1);
    }
  }, [selectedNode]);

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

  /**
   * Reset websocket when node changes
   */
  useEffect(() => {
    setWS_Connected(false);
  }, [selectedNode]);

  /**
   * Setup websocket
   */
  useEffect(() => {
    if (WS_Connected) return;

    let cleanup;

    ConnectToWS(
      setWSMessageMenuItem,
      setWS_Connected,
      fieldsType.dataSourceName,
    )
      .then(() => console.log("🔌 WebSocket connected"))
      .catch(() => {});

    return () => {
      if (cleanup) cleanup();
    };
  }, [WS_Connected]);

  /**
   * Websocket update rows
   */
  const callbackReducerUpdate = async (ws_updatedRows) => {
    await reducerDispatch({
      type: "WS_OPE_ROW",
      payload: {
        rows: ws_updatedRows.rows,
        totalCount: ws_updatedRows.totalCount,
      },
    });
  };

  /**
   * Handle websocket message
   */
  useEffect(() => {
    if (!_wsMessageMenuItem) return;

    const handler = new WSMessageHandler({
      _WSsetMessage: _wsMessageMenuItem,
      fieldsType,
      rows,
      totalCount,
      callbackReducerUpdate,
    });

    handler.process();
  }, [_wsMessageMenuItem]);

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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
