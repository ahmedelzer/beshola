import React, {
  useRef,
  useEffect,
  useState,
  Children,
  useCallback,
} from "react";
import { Platform, View, ActivityIndicator, Text } from "react-native"; // Added Text/ActivityIndicator
import WebView from "react-native-webview";
import schema from "../../Schemas/Map/PolygonSchema.json";
import DrawerComponent from "./DrawerComponent";
import { store } from "../../store/reduxStore";
import { selectCurrentLocation } from "../../reducers/LocationReducer";

const PolygonMapEmbed = ({
  canClickPolygon = true,
  location = null,
  clickable = false,
  polygonClickable = false,
  fields = [
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLatitudePoint",
      parameterField: "latitude",
      parameterTitel: "locationLatitudePoint",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLongitudePoint",
      parameterField: "longitude",
      parameterTitel: "locationLongitudePoint",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
  ],
  locationFields = [
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLatitudePoint",
      parameterField: "locationLatitudePoint",
      parameterTitel: "locationLatitudePoint",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
    {
      dashboardFormSchemaParameterID: "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
      dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f898",
      isEnable: true,
      parameterType: "areaMapLongitudePoint",
      parameterField: "locationLongitudePoint",
      parameterTitel: "locationLongitudePoint",
      isIDField: false,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 0,
    },
  ],
  haveRadius = true,
  clickAction = "pin",
  //host = "http://localhost:3001",
  host = "https://ihs-solutions.com:7552",
  onLocationChange,
  setNewPolygon,
  showSuggestsCard = true,
  areaLocations = [],
}) => {
  console;
  const webRef = useRef(null);
  const iframeRef = useRef(null);
  const locationsRef = useRef(areaLocations);
  const [coords] = useState(
    location || selectCurrentLocation(store.getState()),
  );
  const [polygonObj, setPolygonObj] = useState({});
  const [minimizeDrawer, setMinimizeDrawer] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const setLocationsCallback = useCallback((newLocations) => {
    locationsRef.current = newLocations;

    sendLocationsToMap();
  }, []);
  // 1. Stable function to send locations
  const sendLocationsToMap = useCallback(() => {
    const payload = {
      type: "UPDATE_LOCATIONS",
      payload: [...locationsRef.current, ...areaLocations],
    };

    if (Platform.OS === "web") {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(payload, "*");
      }
    } else {
      if (webRef.current) {
        webRef.current.postMessage(JSON.stringify(payload));
      }
    }
  }, [areaLocations]);

  // 2. CRITICAL: Re-send locations whenever they change
  const lastSentLocationsRef = useRef("");

  useEffect(() => {
    if (isLoading) return;

    const currentLocations = [...locationsRef.current, ...areaLocations];
    const currentStr = JSON.stringify(currentLocations);

    // 1. Only act if data is actually different
    if (lastSentLocationsRef.current !== currentStr) {
      // 2. Clear previous timer
      const handler = setTimeout(() => {
        // console.log("Debounced send to map:", currentLocations.length);
        sendLocationsToMap();
        lastSentLocationsRef.current = currentStr;
      }, 500); // Wait 500ms after the last change

      return () => clearTimeout(handler);
    }
  }, [locationsRef.current, areaLocations, isLoading, sendLocationsToMap]);

  // 3. Clean URL (No locations here)
  const params = new URLSearchParams({
    location: JSON.stringify(coords),
    clickable: String(clickable),
    fields: JSON.stringify(fields),
    locationsFields: JSON.stringify(locationFields),
    haveRadius: String(haveRadius),
    findServerContainer: JSON.stringify(schema),
    clickAction: clickAction,
    polygonClickable: String(polygonClickable),
  });

  const url = `${host}/displayMap?${params.toString()}`;

  const switchFun = (data) => {
    if (!canClickPolygon || !data) return;
    if (data.type === "locationChange") onLocationChange?.(data.payload);
    else if (data.type === "newPolygonChange") setNewPolygon?.(data.payload);
    else if (data.type === "clickedPolygon") {
      setPolygonObj(data.payload);
      setMinimizeDrawer(false);
    } else if (data.type === "MAP_READY") {
      sendLocationsToMap();
    }
  };

  // --- MOBILE ---
  if (Platform.OS !== "web") {
    return (
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ uri: url }}
          onLoadEnd={() => {
            setIsLoading(false);
            sendLocationsToMap();
          }}
          onMessage={(event) => {
            try {
              switchFun(JSON.parse(event.nativeEvent.data));
            } catch (e) {}
          }}
        />
        {showSuggestsCard && (
          <DrawerComponent
            polygonObj={polygonObj}
            minimizeDrawer={minimizeDrawer}
            setMinimizeDrawer={setMinimizeDrawer}
            setLocations={setLocationsCallback}
          />
        )}
      </View>
    );
  }

  // --- WEB ---
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        switchFun(data);
      } catch (error) {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [locationsRef.current, areaLocations, onLocationChange]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
      }}
    >
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={() => {
          setIsLoading(false);
          sendLocationsToMap();
        }}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in",
        }}
      />
      {showSuggestsCard && (
        <DrawerComponent
          polygonObj={polygonObj}
          minimizeDrawer={minimizeDrawer}
          setMinimizeDrawer={setMinimizeDrawer}
          setLocations={setLocationsCallback}
        />
      )}
    </div>
  );
};

export default PolygonMapEmbed;
