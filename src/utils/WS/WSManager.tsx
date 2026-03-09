import { WSclass } from "../../../components/hooks/ws/WS_Class";
import {
  addInstance,
  addInstanceStateHandlingMessage,
  removeInstance,
} from "../../reducers/WS_Reducer";
import { store } from "../../store/reduxStore";

// -------------------------
// Get WebSocket instance
// -------------------------
export function getWSInstance(baseUrl, url, onMessageCallback) {
  if (!baseUrl || !url) {
    throw new Error("baseUrl and url are required");
  }

  const wsInstances = store.getState().ws?.wsInstances || [];
  let instance = wsInstances.find((inst) => inst.key === baseUrl);

  const isClosed =
    !instance ||
    instance.ws.readyState === WebSocket.CLOSING ||
    instance.ws.readyState === WebSocket.CLOSED ||
    instance.url !== url;

  // -------------------------
  // Create or Recreate Instance
  // -------------------------
  if (isClosed) {
    if (instance && instance.url !== url) {
      disconnectWS(baseUrl, true);
    }

    const wsInstance = new WSclass(url);

    const removeHandler = wsInstance.connect(() => {
      if (typeof onMessageCallback === "function") {
        return wsInstance.addMessageHandler(onMessageCallback);
      }
    });

    store.dispatch(removeInstance({ key: baseUrl }));
    store.dispatch(
      addInstance({
        key: baseUrl,
        url,
        ws: wsInstance, // ALWAYS store WSclass
        handlingMessages:
          typeof onMessageCallback === "function" ? [onMessageCallback] : [],
        connected: true,
      }),
    );

    return { instance: wsInstance, removeHandler };
  }

  // -------------------------
  // Sanity check instance
  // -------------------------
  if (!(instance.ws instanceof WSclass)) {
    console.error("Invalid ws instance: not a WSclass", instance.ws);
    disconnectWS(baseUrl, true);
    return getWSInstance(baseUrl, url, onMessageCallback);
  }

  // -------------------------
  // Re-add message handler if needed
  // -------------------------
  if (typeof onMessageCallback === "function") {
    if (!instance.handlingMessages.includes(onMessageCallback)) {
      const removeHandler = instance.ws.addMessageHandler(onMessageCallback);

      store.dispatch(
        addInstanceStateHandlingMessage({
          key: baseUrl,
          handlingMessage: onMessageCallback,
        }),
      );

      return { instance: instance.ws, removeHandler };
    }
  }

  // -------------------------
  // Reconnect if socket is not open
  // -------------------------
  if (instance.ws.readyState !== WebSocket.OPEN) {
    try {
      instance.ws.connect();
    } catch (error) {
      console.error("Failed to reconnect WebSocket:", error);
      throw error;
    }
  }

  return { instance: instance.ws };
}

// -------------------------
// Disconnect WebSocket
// -------------------------
export function disconnectWS(baseUrl, force = false) {
  const wsInstances = store.getState().ws?.wsInstances || [];
  const instance = wsInstances.find((inst) => inst.key === baseUrl);

  if (!instance) return;

  const wsObj = instance.ws; // WSclass

  if (force || instance.handlingMessages.length === 0) {
    try {
      wsObj?.disconnect?.(); // <-- correct call
      store.dispatch(removeInstance({ key: baseUrl }));
    } catch (error) {
      console.error("Failed to disconnect WebSocket:", error);
    }
  }
}

// -------------------------
export function isWSConnected(baseUrl) {
  const wsInstances = store.getState().ws?.wsInstances || [];
  const instance = wsInstances.find((inst) => inst.key === baseUrl);
  return instance?.ws?.readyState === WebSocket.OPEN || false;
}
