import React, { useRef, useEffect, useState } from "react";
import { Platform, View, ActivityIndicator, Text } from "react-native"; // Added Text/ActivityIndicator
import WebView from "react-native-webview";
import schema from "../../Schemas/Map/PolygonSchema.json";
import DrawerComponent from "./DrawerComponent";
import { store } from "../../store/reduxStore";

const PolygonMapEmbed = ({
  location = {},
  clickable = false,
  fields = [
    /* ... your default fields ... */
  ],
  haveRadius = true,
  clickAction = "pin",
  //host = "http://localhost:3001",
  host = "https://ihs-solutions.com:7552",
  onLocationChange,
  setNewPolygon,
}) => {
  const webRef = useRef(null);
  const iframeRef = useRef(null);
  const locationRef = useRef(JSON.stringify(location));
  const [polygonObj, setPolygonObj] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

  // New Loading State
  const [isLoading, setIsLoading] = useState(true);

  const drawerComponent = openDrawer && (
    <DrawerComponent
      polygonObj={polygonObj}
      openDrawer={openDrawer}
      setOpenDrawer={setOpenDrawer}
    />
  );

  useEffect(() => {
    if (Object.keys(polygonObj).length > 0) {
      setOpenDrawer(true);
    }
  }, [polygonObj]);

  const params = new URLSearchParams({
    location: locationRef.current,
    clickable,
    fields: JSON.stringify(fields),
    haveRadius,
    findServerContainer: JSON.stringify(schema),
    clickAction,
  });

  const url = `${host}/displayMap?${params.toString()}`;
  console.log("====================================");
  console.log(location, "params");
  console.log("====================================");
  const switchFun = (data) =>
    windowMessageSwitch(data, onLocationChange, setNewPolygon, setPolygonObj);

  // --- RENDERING EARTH OVERLAY (Shared Logic) ---
  const LoadingOverlay = () => (
    <View
      style={{
        ...Platform.select({
          web: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          },
          default: { ...View.absoluteFillObject, zIndex: 10 },
        }),
        backgroundColor: "#050505",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* This mimics the "Earth" render feel */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#1a2a6c",
          shadowColor: "#4facfe",
          shadowOpacity: 0.8,
          shadowRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        <ActivityIndicator size="large" color="#00f2fe" />
      </View>
      <Text
        style={{
          color: "#fff",
          marginTop: 20,
          letterSpacing: 2,
          fontWeight: "300",
          fontSize: 12,
        }}
      >
        RENDERING EARTH
      </Text>
    </View>
  );

  // ✅ React Native (Mobile)
  if (Platform.OS !== "web") {
    return (
      <View style={{ width: "100%", height: 400, position: "relative" }}>
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
            const data = JSON.parse(event.nativeEvent.data);
            switchFun(data);
          }}
        />
        {drawerComponent}
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
        height: "400px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#050505",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px solid #00f2fe",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
            }}
          />
          <p
            style={{
              color: "#00f2fe",
              marginTop: "15px",
              fontFamily: "monospace",
            }}
          >
            INITIALIZING SPATIAL DATA...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

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

      {drawerComponent}
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
