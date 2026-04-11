import React, { useRef, useEffect } from "react";
import {
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import AssetsSchemaActions from "../../Schemas/MenuSchema/AssetsSchemaActions.json";
import { addAlpha } from "../../utils/operation/addAlpha";
import { theme } from "../../Theme";
import { scale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MapDrawer = ({ row, onMinimize, minimize, setLocations }) => {
  // --- Constants ---
  const MIN_HEIGHT = 80;
  const MAX_HEIGHT = 600;
  const MIN_WIDTH = scale(120); // Small square-ish shape when minimized
  const MAX_WIDTH = SCREEN_WIDTH - 20; // Almost full width when expanded

  // --- Animated Values ---
  const drawerHeight = useRef(
    new Animated.Value(minimize ? MIN_HEIGHT : 400),
  ).current;
  const drawerWidth = useRef(
    new Animated.Value(minimize ? MIN_WIDTH : MAX_WIDTH),
  ).current;

  // Internal refs to keep track of values for PanResponder calculations
  const lastHeight = useRef(minimize ? MIN_HEIGHT : 400);
  const lastWidth = useRef(minimize ? MIN_WIDTH : MAX_WIDTH);

  // --- Combined Scale Logic ---
  // We sum Height + Width to get a "Total Size" value.
  const totalSize = Animated.add(drawerHeight, drawerWidth);

  // We interpolate that sum so the icon grows based on the total area change.
  const iconScale = totalSize.interpolate({
    inputRange: [MIN_HEIGHT + MIN_WIDTH, MAX_HEIGHT + MAX_WIDTH],
    outputRange: [1, 1.5], // Scales from 100% to 150% size
    extrapolate: "clamp",
  });

  // --- Sync Listeners ---
  useEffect(() => {
    const hListener = drawerHeight.addListener(
      ({ value }) => (lastHeight.current = value),
    );
    const wListener = drawerWidth.addListener(
      ({ value }) => (lastWidth.current = value),
    );
    return () => {
      drawerHeight.removeListener(hListener);
      drawerWidth.removeListener(wListener);
    };
  }, []);

  // --- Handle Minimize Toggle ---
  useEffect(() => {
    Animated.parallel([
      Animated.spring(drawerHeight, {
        toValue: minimize ? MIN_HEIGHT : 400,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }),
      Animated.spring(drawerWidth, {
        toValue: minimize ? MIN_WIDTH : MAX_WIDTH,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }),
    ]).start();
  }, [minimize]);

  // --- PanResponder Logic ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 2 || Math.abs(gesture.dx) > 2,

      onPanResponderGrant: () => {
        // Prepare for smooth relative movement
        drawerHeight.setOffset(lastHeight.current);
        drawerWidth.setOffset(lastWidth.current);
        drawerHeight.setValue(0);
        drawerWidth.setValue(0);
      },

      onPanResponderMove: (_, gesture) => {
        // 1. Calculate Y (Height) - Dragging UP is negative dy
        const nextHeight = lastHeight.current - gesture.dy;
        if (nextHeight >= MIN_HEIGHT && nextHeight <= MAX_HEIGHT) {
          drawerHeight.setValue(-gesture.dy);
        }

        // 2. Calculate X (Width) - Dragging LEFT is negative dx
        const nextWidth = lastWidth.current - gesture.dx;
        if (nextWidth >= MIN_WIDTH && nextWidth <= MAX_WIDTH) {
          drawerWidth.setValue(-gesture.dx);
        }
      },

      onPanResponderRelease: () => {
        drawerHeight.flattenOffset();
        drawerWidth.flattenOffset();

        // Snap to minimize if dragged too low
        if (lastHeight.current < 150 && !minimize) {
          onMinimize();
        }
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.drawerContainer,
        {
          height: drawerHeight,
          width: drawerWidth,
          backgroundColor: addAlpha(theme.accent, 0.15),
          borderRadius: minimize ? scale(12) : 24,
          ...(Platform.OS === "web" ? { touchAction: "none" } : {}),
        },
      ]}
    >
      {!minimize && (
        <>
          {/* Header Drag Handle */}
          <View
            {...panResponder.panHandlers}
            style={[
              styles.header,
              { backgroundColor: addAlpha(theme.accentHover, 0.3) },
            ]}
          >
            <View style={styles.dragIcon}>
              <AntDesign
                name="minus"
                size={35}
                color={theme.body}
                style={{ opacity: 0.4 }}
              />
            </View>
          </View>

          {/* Body Content */}
          <View style={styles.body}>
            <SuggestCardContainer
              row={row}
              setRows={setLocations}
              suggestContainerType={0}
              schemaActions={AssetsSchemaActions}
              // Icon resizing handles the visual feedback,
              // but we pass a scaled base value to the container.
              imageScale={scale(90)}
            />
          </View>
        </>
      )}

      {/* The Smooth Resizing Corner Icon */}
      <Animated.View
        style={[
          styles.cornerIconWrapper,
          { transform: [{ scale: iconScale }] },
        ]}
      >
        <TouchableOpacity
          onPress={onMinimize}
          style={[
            styles.iconButton,
            { backgroundColor: addAlpha(theme.accent, 0.9) },
          ]}
        >
          <AntDesign
            name={minimize ? "arrowsalt" : "shrink"}
            size={18}
            color={theme.body}
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    bottom: 10,
    right: 10, // Anchored to bottom-right
    zIndex: 9999,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  header: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" ? { cursor: "grab" } : {}),
  },
  dragIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  cornerIconWrapper: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10000,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapDrawer;
