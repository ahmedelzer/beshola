import React, { useEffect, useReducer, useState } from "react";
import { ScrollView } from "react-native";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { createRowCache } from "../Pagination/createRowCache";
import { getRemoteRows } from "../Pagination/getRemoteRows";
import { initialState, VIRTUAL_PAGE_SIZE } from "../Pagination/initialState";
import reducer from "../Pagination/reducer";
import AddLocation from "./AddLocation";
import { useSchemas } from "../../../context/SchemaProvider";
import { useAuth } from "../../../context/auth";
export default function AddressLocation() {
  const { addressLocationState } = useSchemas();
  const { userGust } = useAuth();
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(10, addressLocationState.schema.idField),
  );

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
    addressLocationState.actions &&
    addressLocationState.actions?.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const { rows, skip, totalCount, loading } = state;

  useEffect(() => {
    if (userGust) return;
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
    });
  }, [userGust]);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isScrolledToBottom && rows.length < totalCount && !loading) {
      getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, reducerDispatch); //todo change dispatch by reducerDispatch
      setCurrentSkip(currentSkip + 1);
    }
  };
  const AddAddressLocation = (row) => {
    reducerDispatch({
      type: "UPDATE_ROWS",
      payload: {
        rows: [row],
        totalCount: state.totalCount + 1,
      },
    });
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      className="mt-4"
    >
      <AddLocation
        rows={rows}
        onScroll={handleScroll}
        AddAddressLocation={AddAddressLocation}
        loading={loading}
      />
    </ScrollView>
  );
}
