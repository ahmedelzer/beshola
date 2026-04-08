import { useEffect, useReducer, useState } from "react";
import reducer from "./reducer";
import {
  initialState,
  OFF_SET_SCROLL,
  VIRTUAL_PAGE_SIZE,
} from "./initialState";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { createRowCache } from "./createRowCache";
import { getRemoteRows } from "./getRemoteRows";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";

export const usePreloadList = ({
  idField,
  schemaActions,
  row,
  cacheTime = VIRTUAL_PAGE_SIZE,
  pageIndex,
  PrepareLoadValidation = () => true,
  deps = [],
}: {
  idField: string;
  schemaActions: Array<{
    dashboardFormActionMethodType: string;
    [key: string]: any;
  }>;
  row: any;
  pageIndex?: number;
  PrepareLoadValidation?: Function;
  cacheTime?: number;
  deps?: any[];
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState(cacheTime, idField),
  );
  const [currentSkip, setCurrentSkip] = useState(0);

  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((prev) => prev + 1);
  const getAction =
    schemaActions &&
    schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );
  const dataSourceAPI = (query: any, skip: number, take: number) => {
    return buildApiUrl(query, {
      pageIndex: pageIndex || skip + 1,
      pageSize: take,
      ...row,
    });
  };

  useEffect(() => {
    if (!PrepareLoadValidation() && !getAction) return;

    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache: createRowCache(cacheTime),
      reducerDispatch: dispatch,
      abortController: false,
      reRequest: true,
    });
  }, [reloadKey, currentSkip, ...deps]);
  const handleScroll = (event: any) => {
    const { rows, totalCount, loading } = state;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - OFF_SET_SCROLL;

    if (!isScrolledToBottom || loading || rows.length >= totalCount) return;

    const remaining = totalCount - rows.length;
    if (remaining <= 0) return;

    const take = Math.min(cacheTime * 2, remaining);

    getRemoteRows(currentSkip, cacheTime, dispatch);
    setCurrentSkip((prev) => prev + take);
  };
  return {
    ...state,
    state: state,
    reload,
    dispatch,
    handleScroll,
    setCurrentSkip,
  };
};
