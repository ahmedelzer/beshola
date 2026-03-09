import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { GetToken, websocketBaseURI } from "../../../request";
import defWSSchemaAction from "../../Schemas/WSSchema/WSSchemaAction.json";
import { disconnectWS, getWSInstance } from "./WSManager";

export async function ConnectToWS(
  setWSsetMessage,
  setWS_Connected,
  dataSourceName,
  row = {},
  wS_SchemaAction = defWSSchemaAction,
) {
  const token = await GetToken();

  if (!token) {
    console.warn("🛑 No token found, skipping WebSocket connection");
    return;
  }

  const buildUrl = buildApiUrl(
    wS_SchemaAction,
    { ...row, token },
    websocketBaseURI + "/" + wS_SchemaAction.projectProxyRoute,
  );

  // ----------------------------
  // HANDLE MESSAGE
  // ----------------------------
  const handleMessage = (WSMessage) => {
    try {
      const bufferObj = JSON.parse(WSMessage);
      const byteArray = new Uint8Array(bufferObj.data);
      const urlEncodedString = new TextDecoder().decode(byteArray);
      const decodedString = decodeURIComponent(urlEncodedString);

      console.log("parsed[dataSourceName]:", decodedString);
      if (decodedString.length === 0) return;
      const parsed = JSON.parse(decodedString);
      if (!parsed?.[dataSourceName]) return;

      setWSsetMessage(() => parsed);
    } catch (err) {
      console.error("❌ Failed to decode WebSocket message:", err);
    }
  };

  const wsKey =
    websocketBaseURI +
    "/" +
    wS_SchemaAction.projectProxyRoute +
    "/" +
    wS_SchemaAction.routeAdderss;

  const { removeHandler } = getWSInstance(wsKey, buildUrl, handleMessage);

  setWS_Connected(true);

  // ----------------------------
  // CLEANUP
  // ----------------------------
  return () => {
    try {
      removeHandler();
      disconnectWS(wsKey);
      setWS_Connected(false);
    } catch (err) {
      console.error("❌ Failed to cleanup WebSocket:", err);
    }
  };
}
