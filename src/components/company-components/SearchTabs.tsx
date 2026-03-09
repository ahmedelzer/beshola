import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, HStack, Pressable, Text } from "../../../components/ui";
import { initialState, VIRTUAL_PAGE_SIZE } from "../Pagination/initialState";
import reducer from "../Pagination/reducer";
// import { createRowCache } from "@devexpress/dx-react-grid";
// import { createRowCache } from "../Pagination/createRowCache";
import { Flow } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../components/hooks/APIsFunctions/LoadData";
import { useSearch } from "../../../context/SearchProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import LoadingScreen from "../../kitchensink-components/loading/LoadingScreen";
import { isRTL } from "../../utils/operation/isRTL";
import { createRowCache } from "../Pagination/createRowCache";
import { getRemoteRows } from "../Pagination/getRemoteRows";
import { updateRows } from "../Pagination/updateRows";
import { ScreenWidth } from "../shared";
export const SearchTabs = ({}: any) => {
  // Shop/GetMenuCategories?PageSize=11&PageNumber=1
  const { menuCategoriesState } = useSchemas();
  const { menuItemRow, setMenuItemRow } = useSearch();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("");
  const activeMenuType = useSelector((state) => state.menuItem.currentItemType);
  const menuItems = useSelector((state) => state.menuItem.menuItem);
  const idField = menuCategoriesState.schema.idField;
  const display = menuCategoriesState.schema.dashboardFormSchemaParameters.find(
    (pram) => pram.parameterType === "tabDisplay",
  ).parameterField;
  const localization = useSelector((state) => state.localization.localization);
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, menuCategoriesState.schema.idField),
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
    menuCategoriesState.actions &&
    menuCategoriesState.actions.find(
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
  //todo make sure when menu items change that depend on categoryId and filter and search by API and make caching
  //todo by in case offline make it with out api
  return (
    <Box className="border-b border-outline-50 md:border-b-0 md:border-transparent">
      <Box className="flex flex-row justify-between flex-wrap gap-5">
        <ScrollView
          onScroll={handleScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          inverted={isRTL()}
          contentContainerStyle={{
            direction: "inherit",
          }}
          key={activeTab}
        >
          <HStack
            space="lg"
            className={`mx-0.5 xl:gap-5 2xl:gap-6 flex ${
              isRTL() ? "flex-row" : "flex-row"
            } justify-center items-center`}
            style={{ direction: "inherit", flexWrap: "nowrap" }}
          >
            {[
              {
                [idField]: "0",
                [display]: "Buy",
              },
              {
                [idField]: "1",
                [display]: "Retail",
              },
              {
                [idField]: "2",
                [display]: "Wholesale",
              },
              {
                [idField]: "3",
                [display]: "Export",
              },
            ].map((tab) => {
              const isActive = activeTab === tab[idField];
              return (
                <Pressable
                  key={tab[idField]}
                  // ✅ Each tab is exactly half the screen width
                  style={{
                    width: ScreenWidth / 2 - 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={`px-4 py-2 mx-1 rounded-full border ${
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-transparent hover:border-accent/40"
                  } transition-all duration-200`}
                  onPress={() => {
                    if (activeTab !== tab[idField]) {
                      setMenuItemRow({
                        ...menuItemRow,
                        [idField]: tab[idField],
                        [display]: tab[display],
                      });
                      setActiveTab(tab[idField]);
                    }
                  }}
                >
                  <Text
                    size="sm"
                    className={`font-semibold ${
                      isActive ? "text-accent" : "text-dark_card"
                    }`}
                  >
                    {tab[display]}
                  </Text>
                </Pressable>
              );
            })}

            {loading && <LoadingScreen LoadingComponent={<Flow size={40} />} />}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};
