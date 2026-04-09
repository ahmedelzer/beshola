import { View } from "react-native";
import React from "react";
import MapDrawer from "./MapDrawer";
import { useTab } from "../../../context/TabsProvider";

const DrawerComponent = ({
  polygonObj,
  setMinimizeDrawer,
  minimizeDrawer,
  setLocations,
}) => {
  const tab = useTab() || {};
  const { activeTab } = tab;

  const row = {
    areaIDs: [polygonObj?.areaID],
    ...activeTab,
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        pointerEvents: "auto",
        alignItems: "flex-start",
      }}
    >
      <MapDrawer
        row={row}
        onMinimize={() => setMinimizeDrawer(!minimizeDrawer)}
        minimize={minimizeDrawer}
        setLocations={setLocations}
      />
    </View>
  );
};

export default DrawerComponent;
