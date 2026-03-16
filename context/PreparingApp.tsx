import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { buildApiUrl } from "../components/hooks/APIsFunctions/BuildApiUrl";
import AddressLocationSchema from "../src/Schemas/AddressLocation/AddressLocation.json";
import AddressLocationAction from "../src/Schemas/AddressLocation/AddressLocationAction.json";
import NearestBranchesSchema from "../src/Schemas/AddressLocation/NearestBranches.json";
import NearestBranchesActions from "../src/Schemas/AddressLocation/NearestBranchesActions.json";
import WorkingHoursSchemaActions from "../src/Schemas/AddressLocation/WorkingHoursSchemaActions.json";
import CurrencyTypesSchemaActions from "../src/Schemas/MenuSchema/CurrencyTypesSchemaActions.json";
import AssetsSchema from "../src/Schemas/MenuSchema/AssetsSchema.json";
import { createRowCache } from "../src/components/Pagination/createRowCache";
import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../src/components/Pagination/initialState";
import reducer from "../src/components/Pagination/reducer";
import { onApply } from "../src/components/form-container/OnApply";
import {
  updateContacts,
  updateOrderStatus,
  updateSelectedLocation,
  updateSelectedNode,
  updateWorkingHours,
} from "../src/reducers/LocationReducer";
import { ConnectToWS } from "../src/utils/WS/ConnectToWS";
import { WSMessageHandler } from "../src/utils/WS/handleWSMessage";
import {
  convertUTCToLocalTime,
  getMinutesFromTime,
} from "../src/utils/operation/handleLocalTime";
import { prepareLoad } from "../src/utils/operation/loadHelpers";
import { LocalizationContext } from "./LocalizationContext";
import { useNetwork } from "./NetworkContext";
import { useShopNode } from "./ShopNodeProvider";
import { useAuth } from "./auth";

// Define the shape of the WebSocket context
interface WSContextType {
  notifications: any;
  setNotifications: React.Dispatch<React.SetStateAction<any>>;
}
// Create the WebSocket context
export const WSContext = createContext<WSContextType>({
  notifications: [],
  setNotifications: () => {}, // Default no-op function
});

// WebSocket Context Provider

export const PreparingApp: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  const { selectedNode, setSelectedNode } = useShopNode();
  const [isPrepared, setIsPrepared] = useState({
    setNode: false,
    setWorkingHours: false,
  });
  const { userGust } = useAuth();
  // WebSocket state
  const [WS_Connected, setWS_Connected] = useState(false);
  const [welcomeTime, setWelcomeTime] = useState(Date.now());
  const [_WSsetMessage, setWSsetMessage] = useState<any>(null);
  const { isEndFinishing, setIsEndFinishing } = useContext(LocalizationContext);
  // Address Location state with reducer
  const [addressLocationState, addressLocationReducerDispatch] = useReducer(
    reducer,
    initialState(10, AddressLocationSchema.idField),
  );

  // Redux selectors
  const rows = useSelector((state: any) => state.menuItem.rows);
  const totalCount = useSelector((state: any) => state.menuItem.totalCount);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);

  const selectedTab = useSelector((state: any) => state.location?.selectedTab);

  // Address location API
  const addressLocationDataSourceAPI = (
    query: any,
    skip: number,
    take: number,
  ) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
    });
  };

  const addressLocationCache = createRowCache(VIRTUAL_PAGE_SIZE);
  const addressLocationGetAction = AddressLocationAction?.find(
    (action) => action.dashboardFormActionMethodType === "Get",
  );
  const currencyTypesGetAction = CurrencyTypesSchemaActions?.find(
    (action) => action.dashboardFormActionMethodType === "Get",
  );

  // Local state for selected location
  // const [selectedLocation, setSelectedLocation] = useState(
  //   reduxSelectedLocation || null
  // );
  const { selectedLocation, setSelectedLocation } = useShopNode();

  // Load Address Location on getAction ready
  useEffect(() => {
    if (!addressLocationGetAction || userGust) return;
    if (Object.keys(selectedLocation).length > 0 || selectedTab !== 1) return;
    prepareLoad({
      state: addressLocationState,
      dataSourceAPI: addressLocationDataSourceAPI,
      getAction: addressLocationGetAction,
      cache: addressLocationCache,
      reducerDispatch: addressLocationReducerDispatch,
    });

    if (addressLocationState.rows.length > 0) {
      dispatch(updateSelectedLocation(addressLocationState.rows[0]));
      setSelectedLocation(addressLocationState.rows[0]);
    }
  }, [
    addressLocationGetAction,
    addressLocationState.rows.length,
    dispatch,
    isOnline,
    userGust,
  ]);

  // Nearest Branches state with reducer
  const [nodeState, nodeReducerDispatch] = useReducer(
    reducer,
    initialState(10, NearestBranchesSchema.idField),
  );
  const [nodeMenuItemState, nodeMenuItemReducerDispatch] = useReducer(
    reducer,
    initialState(10, AssetsSchema.idField),
  );
  const nodeDataSourceAPI = (query: any, skip: number, take: number) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...(selectedLocation || {}),
    });
  };

  const nodeCache = createRowCache(VIRTUAL_PAGE_SIZE);
  const nodeGetAction = NearestBranchesActions?.find(
    (action) => action.dashboardFormActionMethodType === "Get",
  );
  // Load Nearest Branches when location is selected and nodeGetAction is ready
  useEffect(() => {
    if (
      !selectedLocation ||
      !nodeGetAction ||
      Object.keys(selectedNode).length > 0
    ) {
      setIsPrepared((prev) => ({ ...prev, setNode: true }));

      return;
    }

    const fetchData = async () => {
      try {
        // wait for prepareLoad to finish
        await prepareLoad({
          state: nodeState,
          dataSourceAPI: nodeDataSourceAPI,
          getAction: nodeGetAction,
          cache: nodeCache,
          reducerDispatch: nodeReducerDispatch,
        });
        // now safely check rows
      } catch (err) {
        console.error("Error in prepareLoad:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, nodeGetAction, isOnline]);
  //load currecy 
  useEffect(() => {

    const fetchData = async () => {
      try {
        // wait for prepareLoad to finish
        await prepareLoad({
          state: nodeState,
          dataSourceAPI: nodeDataSourceAPI,
          getAction: currencyTypesGetAction,
          cache: nodeCache,
          reducerDispatch: nodeReducerDispatch,
        });
        // now safely check rows
      } catch (err) {
        console.error("Error in prepareLoad:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyTypesGetAction, isOnline]);

  useEffect(() => {
    if (nodeState.rows.length > 0 && Object.keys(selectedNode).length <= 0) {
      const firstNode = nodeState.rows[0];
      dispatch(updateSelectedNode(firstNode));
      setSelectedNode(firstNode);
      setIsPrepared((prev) => ({ ...prev, setNode: true }));
    }
  }, [nodeState]);
  useEffect(() => {
    const fetchData = async () => {
      const getAction =
        WorkingHoursSchemaActions &&
        WorkingHoursSchemaActions.find(
          (action) =>
            action.dashboardFormActionMethodType.toLowerCase() === "get",
        );
      try {
        const dataSourceAPIToGetWorkingHours = (query) => {
          return buildApiUrl(query, {});
        };
        const getOpenCustomerRequestByContact = await onApply(
          {},
          null,
          true,
          getAction,
          "",
          false,
          dataSourceAPIToGetWorkingHours(getAction),
        );

        const workingHours =
          getOpenCustomerRequestByContact.data.daysWorkingHours;
        const contacts = getOpenCustomerRequestByContact.data.contacts;
        if (workingHours) {
          // ✅ Save working hours in redux
          dispatch(updateWorkingHours(workingHours));
          dispatch(updateContacts(contacts));
          // ✅ Determine order availability
          const todayIndex = new Date().getDay();
          const currentTime = new Date();

          const todayWorkHour = workingHours.find(
            (w) => w.dayIndex === todayIndex,
          );

          let orderStatus = "closed"; // "open", "nearClosed", "closed"

          if (todayWorkHour) {
            const localStartTime = convertUTCToLocalTime(
              todayWorkHour.startTime,
            );
            const localEndTime = convertUTCToLocalTime(todayWorkHour.endTime);

            const nowMinutes =
              currentTime.getHours() * 60 + currentTime.getMinutes();
            const startMinutes = getMinutesFromTime(localStartTime);
            const endMinutes = getMinutesFromTime(localEndTime);

            if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
              // inside working hours
              const minutesToClose = endMinutes - nowMinutes;
              if (minutesToClose <= 30) {
                orderStatus = "nearClosed"; // ✅ within 30 minutes of closing
              } else {
                orderStatus = "open";
              }
            }
          }

          // ✅ Save status in redux (new action)
          dispatch(updateOrderStatus(orderStatus));
          setIsPrepared((prev) => ({ ...prev, setWorkingHours: true }));
        }
      } catch (err) {
        console.error("Error in prepareLoad:", err);
      }
    };

    fetchData();
  }, [selectedNode]); //!set nodeID and schemaActions
  useEffect(() => {
    setWS_Connected(false);
  }, [selectedNode]);
  // 🔌 WebSocket handler effect on selectedNode change
  useEffect(() => {
    if (!selectedNode || WS_Connected) return;
    let cleanup;
    ConnectToWS(setWSsetMessage, setWS_Connected, fieldsType.dataSourceName)
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch((e) => {
        console.error("❌ Cart WebSocket error", e);
      });

    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
    };
  }, [selectedNode, WS_Connected, isOnline]);
  const callbackReducerUpdate = async (ws_updatedRows) => {
    await nodeMenuItemReducerDispatch({
      type: "WS_OPE_ROW",
      payload: {
        rows: ws_updatedRows.rows,
        totalCount: ws_updatedRows.totalCount,
      },
    });
  };

  useEffect(() => {
    if (nodeMenuItemState.rows.length > 0) {
      const _handleWSMessage = new WSMessageHandler({
        _WSsetMessage,
        fieldsType,
        rows,
        totalCount,
        callbackReducerUpdate,
      });
      _handleWSMessage.process();
    }
  }, [_WSsetMessage]);
  useEffect(() => {
    if (isPrepared.setNode && isPrepared.setWorkingHours)
      setIsEndFinishing(true);
  }, [isPrepared]);

  // if (
  //   !hasSixSecondsPassed &&
  //   (!isPrepared.setNode || !isPrepared.setWorkingHours)
  // ) {
  //   return (
  //     <LoadingScreen
  //       LoadingComponent={
  //         <View className="size-full bg-accent">
  //           <AddMediaCard
  //             source={require("../assets/display/splash.mp4")}
  //             mediaType="video"
  //             customStyle={{ width: "100%", height: "100%" }}
  //           />
  //         </View>
  //       }
  //     />
  //   );
  // }
  ////////////////////////////////
  return (
    <WSContext.Provider
      value={{ notifications: [], setNotifications: () => {} }}
    >
      {isEndFinishing && (
        // <LoadingScreen />
        <>
          {/* <ShopStatusIndicator /> */}
          {children}
        </>
      )}
    </WSContext.Provider>
  );
};
