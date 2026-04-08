// SearchContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../src/components/Pagination/initialState";
import reducer from "../src/components/Pagination/reducer";

import { useDispatch, useSelector } from "react-redux";
import { buildApiUrl } from "../components/hooks/APIsFunctions/BuildApiUrl";

import { createRowCache } from "../src/components/Pagination/createRowCache";
import { getRemoteRows } from "../src/components/Pagination/getRemoteRows";

import LoadData from "../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../src/components/Pagination/updateRows";
import { useSchemas } from "./SchemaProvider";
import { useSearch } from "./SearchProvider";
import ServiceTypesSchema from "../src/Schemas/MenuSchema/ServiceTypesSchema.json";
import ServiceTypesSchemaActions from "../src/Schemas/MenuSchema/ServiceTypesSchemaActions.json";
export const TabsContext = createContext(null);

export const TabsProvider = ({ children }) => {
  const { serviceTypesState } = useSchemas();
  //   const { menuItemRow, setMenuItemRow } = useSearch();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState({});

  const activeMenuType = useSelector((state) => state.menuItem.currentItemType);
  const menuItems = useSelector((state) => state.menuItem.menuItem);
  const idField = ServiceTypesSchema.idField;
  const display = ServiceTypesSchema.dashboardFormSchemaParameters.find(
    (pram) => pram.parameterType === "tabDisplay",
  ).parameterField;
  const localization = useSelector((state) => state.localization.localization);
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, ServiceTypesSchema.idField),
  );
  const serviceTypesFieldsTypes = {
    idField: idField,
    tabDisplay: display,
  };
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,

      // ...row,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    ServiceTypesSchemaActions &&
    ServiceTypesSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const { rows, skip, totalCount, loading } = state;

  useEffect(() => {
    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(reducerDispatch, cache, state),
      reducerDispatch,
    );
  }, [currentSkip]);
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isScrolledToBottom && rows.length < totalCount && !loading) {
      getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, reducerDispatch); //todo change dispatch by reducerDispatch
      setCurrentSkip(currentSkip + 1);
    }
  };
  useEffect(() => {
    if (state.rows.length > 0 && Object.keys(activeTab).length === 0) {
      console.log("====================================");
      console.log(state.rows[0], "enter");
      console.log("====================================");
      setActiveTab(state.rows[0]);
    }
  }, [state]);

  return (
    <TabsContext.Provider
      value={{
        state,
        reducerDispatch,
        handleScroll,
        activeTab,
        setActiveTab,

        serviceTypesFieldsTypes,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export const useTab = () => useContext(TabsContext);
