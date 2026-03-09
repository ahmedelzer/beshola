import { default as React, useEffect, useReducer, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import {
  selectSelectedNode,
  updateSelectedNode,
} from "../../reducers/LocationReducer";
import SelectComponent from "../../utils/component/SelectComponent";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { createRowCache } from "../Pagination/createRowCache";
import { getRemoteRows } from "../Pagination/getRemoteRows";
import { initialState, VIRTUAL_PAGE_SIZE } from "../Pagination/initialState";
import reducer from "../Pagination/reducer";
import { useShopNode } from "../../../context/ShopNodeProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import LocationButton from "../../utils/component/LocationButton";
import { areObjectsEqual } from "../../utils/operation/areObjectsEqual";
export default function NearestBranches() {
  const { nearestBranchesState } = useSchemas();

  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation,
  );
  const node = useSelector(selectSelectedNode);
  const selectedTab = useSelector((state) => state.location.selectedTab);

  const dispatch = useDispatch();

  const idField = nearestBranchesState.schema.idField;
  const displayLookupParam =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayLookup",
    );
  const nodeLatitudePoint =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "nodeLatitudePoint",
    )?.parameterField;
  const nodeLongitudePoint =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "nodeLongitudePoint",
    )?.parameterField;
  const activeNode =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "active",
    )?.parameterField;
  const tagAddress =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "addressLocation",
    );
  const localization = useSelector((state) => state.localization.localization);
  const { selectedNode, setSelectedNode } = useShopNode();
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(10, nearestBranchesState.schema.idField),
  );
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      selectedTab: selectedTab,

      ...selectedLocation,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    nearestBranchesState.actions &&
    nearestBranchesState.actions.find(
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
  }, [dataSourceAPI, selectedLocation]);

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
    if (
      !loading &&
      rows.length > 0 &&
      !rows.find((row) => areObjectsEqual(row, node))
    ) {
      if (Object.keys(node).length > 0) {
        const selectedRow = rows.find((row) => row[idField] === node[idField]);
        setSelectedNode(selectedRow);
        dispatch(updateSelectedNode(selectedRow));
      } else {
        setSelectedNode(rows[0]);
        dispatch(updateSelectedNode(rows[0]));
      }
    }
  }, [loading, selectedTab]);
  return (
    <View className="flex flex-row items-center mt-3 gap-3">
      {node?.[nodeLatitudePoint] && node?.[nodeLongitudePoint] && (
        <LocationButton
          latitude={node?.[nodeLatitudePoint]}
          longitude={node?.[nodeLongitudePoint]}
        />
      )}
      <SelectComponent
        idField={idField}
        labelField={displayLookupParam.lookupDisplayField}
        mapData={rows}
        onValueChange={(selectedID) => {
          const selectedValue = rows.find((row) => row[idField] === selectedID);
          setSelectedNode(selectedValue);
          dispatch(updateSelectedNode(selectedValue)); // store full object
        }}
        subtitle={node?.[tagAddress.parameterField]}
        selectedValue={node?.[displayLookupParam.lookupDisplayField]}
        valueField={idField}
        loading={loading}
      />
    </View>
  );
}
