import { useEffect, useRef, useState } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import { ConnectToWS } from "./ConnectToWS";
import { WSMessageHandler } from "./handleWSMessage";

export const useManageRealtimeDataWithWS = ({
  wsMessage,
  setWSMessage,
  fieldsType,
  rows,
  totalCount,
  reducerDispatch,
  deps = [],
}: {
  wsMessage: any;
  setWSMessage: any;
  fieldsType: any;
  rows: any;
  totalCount: number;
  reducerDispatch: any;
  deps: any;
}) => {
  const { status, isOnline } = useNetwork();
  const [WS_Connected, setWS_Connected] = useState(false);
  // 🔌 Reset WS connection when offline/online changes
  useEffect(() => {
    setWS_Connected(false);
  }, [isOnline, ...deps]);

  // 🌐 Setup WebSocket connection
  useEffect(() => {
    if (WS_Connected) return;

    let cleanup: (() => void) | undefined;

    ConnectToWS(setWSMessage, setWS_Connected, fieldsType?.dataSourceName)
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch(() => {});

    return () => {
      if (cleanup) cleanup();
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [WS_Connected]);

  // 🧠 Reducer callback
  const callbackReducerUpdate = async (ws_updatedRows: {
    rows?: any;
    totalCount?: number;
  }) => {
    // Optional: expose or implement outside
    await reducerDispatch({
      type: "WS_OPE_ROW",
      payload: {
        rows: ws_updatedRows?.rows||[],
        totalCount: ws_updatedRows?.totalCount||0,
      },
    });
  };

  // 📨 Handle incoming WS messages
  useEffect(() => {
    if (!wsMessage) return;

    const handler = new WSMessageHandler({
      _WSsetMessage: wsMessage,
      fieldsType,
      rows,
      totalCount,
      callbackReducerUpdate,
    });

    handler.process();
  }, [wsMessage]);
};
