import React, { useRef, useEffect, useState, Children } from "react";
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
  haveRadius = true,
  clickAction = "pin",
  host = "http://localhost:3001",
  // host = "https://ihs-solutions.com:7552",
  onLocationChange,
  setNewPolygon,
  showSuggestsCard = true,
  areaLocations = [],
}) => {
  const webRef = useRef(null);
  const iframeRef = useRef(null);
  const [coords, setCoords] = useState(
    location || selectCurrentLocation(store.getState()),
  );
  const locationRef = useRef(JSON.stringify(coords));
  const [polygonObj, setPolygonObj] = useState({});
  const [locations, setLocations] = useState(areaLocations);
  const [minimizeDrawer, setMinimizeDrawer] = useState(true);
  // New Loading State
  const [isLoading, setIsLoading] = useState(true);

  const drawerComponent = (_polygonObj) => {
    if (showSuggestsCard)
      return (
        <DrawerComponent
          polygonObj={_polygonObj}
          minimizeDrawer={minimizeDrawer}
          setMinimizeDrawer={setMinimizeDrawer}
          setLocations={setLocations}
        />
      );
    return <></>;
  };

  useEffect(() => {
    if (Object.keys(polygonObj).length > 0 && !clickable) {
      setMinimizeDrawer(false); // Auto-open drawer when polygon is clicked and clickable is false
      console.log("polygonObj", polygonObj);
    }
  }, [polygonObj]);
  useEffect(() => {
    const interval = setInterval(() => {
      const newCoords = selectCurrentLocation(store.getState()); // get latest coords
      const newCoordsStr = JSON.stringify(newCoords);

      if (!location || coords === newCoordsStr) return; // no change

      locationRef.current = JSON.stringify(coords);

      // reload WebView / iframe
      if (webRef.current && Platform.OS !== "web") {
        webRef.current.reload();
      }
      if (iframeRef.current && Platform.OS === "web") {
        const updatedParams = new URLSearchParams({
          location: locationRef.current,
          clickable,
          fields: JSON.stringify(fields),
          locationsFields: JSON.stringify(locationFields),
          haveRadius,
          findServerContainer: JSON.stringify(schema),
          clickAction,
          polygonClickable,
          locations: JSON.stringify(areaLocations),
        });
        iframeRef.current.src = `${host}/displayMap?${updatedParams.toString()}`;
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval); // cleanup
  }, [
    host,
    clickable,
    fields,
    haveRadius,
    clickAction,
    polygonClickable,
    coords,
  ]);

  const params = new URLSearchParams({
    location: locationRef.current,
    clickable,
    fields: JSON.stringify(fields),
    locationsFields: JSON.stringify(locationFields),
    haveRadius,
    findServerContainer: JSON.stringify(schema),
    clickAction,
    polygonClickable,
    locations: JSON.stringify(areaLocations),
  });

  const url = `${host}/displayMap?${params.toString()}`;
  const switchFun = (data) => {
    if (canClickPolygon)
      return windowMessageSwitch(
        data,
        onLocationChange,
        setNewPolygon,
        setPolygonObj,
      );
  };

  // --- RENDERING EARTH OVERLAY (Shared Logic) ---

  // ✅ React Native (Mobile)
  if (Platform.OS !== "web") {
    return (
      <View style={{ width: "100%", height: "100%", position: "relative" }}>
        {isLoading && <LoadingOverlay />}
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ uri: url }}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setIsLoading(false)} // Hides Earth on Mobile
          onMessage={async (event) => {
            if (canClickPolygon) {
              const data = JSON.parse(event.nativeEvent.data);
              switchFun(data);
            }
          }}
        />
        {drawerComponent(polygonObj)}
      </View>
    );
  }

  // ✅ WEB (iframe)
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
  }, [onLocationChange, setNewPolygon]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={() => setIsLoading(false)} // Hides Earth on Web
        title="Polygon Map"
        scrolling="no"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.8s ease-in",
        }}
      />

      {drawerComponent(polygonObj)}
    </div>
  );
};

const windowMessageSwitch = (
  data,
  onLocationChange,
  setNewPolygon,
  setClickedPolygon,
) => {
  if (data.type === "locationChange") {
    onLocationChange(data.payload);
  } else if (data.type === "newPolygonChange") {
    setNewPolygon(data.payload);
  } else if (data.type === "clickedPolygon") {
    setClickedPolygon(data.payload);
  }
};

export default PolygonMapEmbed;
