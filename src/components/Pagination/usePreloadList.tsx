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

export const usePreloadList = ({
  idField,
  getAction,
  dataSourceAPI,
  cacheTime = VIRTUAL_PAGE_SIZE,
  deps = [],
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState(cacheTime, idField),
  );
  const [currentSkip, setCurrentSkip] = useState(0);

  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((prev) => prev + 1);

  useEffect(() => {
    if (!getAction) return;

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
  const handleScroll = (event) => {
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
    reload,
    dispatch,
    handleScroll,
  };
};
