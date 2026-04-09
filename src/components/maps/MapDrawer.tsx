// import React, { useState, useRef, useEffect } from "react";
// import { View, PanResponder, TouchableOpacity, Animated, StyleSheet } from "react-native";
// import SuggestCardContainer from "../suggest/SuggestCardContainer";
// import AssetsSchemaActions from "../../Schemas/MenuSchema/AssetsSchemaActions.json";
// import { addAlpha } from "../../utils/operation/addAlpha";
// import { theme } from "../../Theme";
// import { scale } from "react-native-size-matters";
// import { AntDesign } from "@expo/vector-icons";

// const MapDrawer = ({ row, onMinimize, minimize }) => {
//   const MIN_HEIGHT = 80;
//   const MAX_HEIGHT = 600;

//   const drawerHeight = useRef(new Animated.Value(minimize ? MIN_HEIGHT : 400)).current;
//   const [startY, setStartY] = useState(null);
//   const [imageScale, setImageScale] = useState(90);

//   useEffect(() => {
//     const listener = drawerHeight.addListener(({ value }) => {
//       const scaleValue = ((value - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 90 + 60;
//       setImageScale(scaleValue);
//     });
//     return () => drawerHeight.removeListener(listener);
//   }, []);

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => false,
//     onMoveShouldSetPanResponder: (_, gestureState) => {
//       // Only capture the touch if the user moves vertically more than 5px
//       // This "limits the action" so buttons still work.
//       return Math.abs(gestureState.dy) > 5;
//     },
//     onPanResponderGrant: (_, gestureState) => {
//       setStartY(gestureState.y0);
//     },
//     onPanResponderMove: (_, gestureState) => {
//       if (startY === null) return;
//       const dy = startY - gestureState.moveY;
//       const nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, drawerHeight._value + dy));
//       drawerHeight.setValue(nextHeight);
//       setStartY(gestureState.moveY);
//     },
//     onPanResponderRelease: () => setStartY(null),
//   });

//   const toggleMinimize = () => {
//     Animated.timing(drawerHeight, {
//       toValue: minimize ? 400 : MIN_HEIGHT,
//       duration: 250,
//       useNativeDriver: false,
//     }).start();
//     onMinimize();
//   };

//   return (
//     <Animated.View
//       // pointerEvents="auto" is the standard RN way to handle touch limitations
//       pointerEvents="auto"
//       style={[
//         styles.drawerContainer,
//         {
//           height: drawerHeight,
//           backgroundColor: addAlpha(theme.accent, 0.15),
//           borderRadius: minimize ? scale(12) : 24,
//         },
//       ]}
//     >
//       {!minimize && (
//         <>
//           {/* Header / Drag Handle */}
//           <View
//             {...panResponder.panHandlers}
//             style={[styles.header, { backgroundColor: addAlpha(theme.accentHover, 0.2) }]}
//           >
//             {/* Center Icon (Full Width Container) */}
//             <View style={styles.dragIconContainer}>
//               <AntDesign name="arrowsalt" size={22} color={theme.body} />
//             </View>

//             {/* Minimize Button */}
//             <TouchableOpacity
//               onPress={toggleMinimize}
//               style={styles.iconButton}
//               hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
//             >
//               <AntDesign name="minuscircle" size={22} color={theme.body} />
//             </TouchableOpacity>
//           </View>

//           {/* Body Content */}
//           <View style={styles.body}>
//             <SuggestCardContainer
//               row={row}
//               suggestContainerType={0}
//               schemaActions={AssetsSchemaActions}
//               imageScale={scale(imageScale)}
//             />
//           </View>
//         </>
//       )}

//       {minimize && (
//         <TouchableOpacity
//           style={styles.minimizedButton}
//           onPress={toggleMinimize}
//         >
//           <AntDesign name="pluscircle" size={24} color={theme.body} />
//         </TouchableOpacity>
//       )}
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   drawerContainer: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     left: 10, // Ensures full width across the screen
//     zIndex: 10,
//     overflow: "hidden",
//     flexDirection: "column",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     height: 50,
//   },
//   dragIconContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 32, // Offsets the center slightly so it looks centered relative to the minus button
//   },
//   iconButton: {
//     padding: 5,
//   },
//   body: {
//     flex: 1,
//     padding: 10,
//   },
//   minimizedButton: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   }
// });

// export default MapDrawer;
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import AssetsSchemaActions from "../../Schemas/MenuSchema/AssetsSchemaActions.json";
import { addAlpha } from "../../utils/operation/addAlpha";
import { theme } from "../../Theme";
import { scale } from "react-native-size-matters";
import { AntDesign } from "@expo/vector-icons";

const MapDrawer = ({ row, onMinimize, minimize, setLocations }) => {
  const MIN_HEIGHT = 80;
  const MAX_HEIGHT = 600;
  const drawerHeight = useRef(
    new Animated.Value(minimize ? MIN_HEIGHT : 250),
  ).current;
  const lastHeight = useRef(minimize ? MIN_HEIGHT : 250);

  // Re-added: State for the dynamic image size
  const [imageScale, setImageScale] = useState(90);

  useEffect(() => {
    const listener = drawerHeight.addListener(({ value }) => {
      lastHeight.current = value;

      // Calculate image scale:
      // Ranges from 60 (at MIN_HEIGHT) to 150 (at MAX_HEIGHT)
      const newScale =
        ((value - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 90 + 60;
      setImageScale(newScale);
    });
    return () => drawerHeight.removeListener(listener);
  }, []);

  useEffect(() => {
    Animated.spring(drawerHeight, {
      toValue: minimize ? MIN_HEIGHT : 400,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [minimize]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 2,

      onPanResponderGrant: () => {
        // Prepare for smooth dragging by setting offset
        drawerHeight.setOffset(lastHeight.current);
        drawerHeight.setValue(0);
      },

      onPanResponderMove: (_, gesture) => {
        // Dragging up (negative dy) increases height
        const nextHeight = lastHeight.current - gesture.dy;

        // Only update if within bounds to prevent jitter
        if (nextHeight >= MIN_HEIGHT && nextHeight <= MAX_HEIGHT) {
          drawerHeight.setValue(-gesture.dy);
        }
      },

      onPanResponderRelease: () => {
        drawerHeight.flattenOffset();

        // Auto-snap logic: if dragged very low, trigger minimize
        if (lastHeight.current < 120 && !minimize) {
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
          backgroundColor: addAlpha(theme.accent, 0.15),
          borderRadius: minimize ? scale(12) : 24,
          // Fixed: Prevent browser refresh/scroll interference
          ...(Platform.OS === "web" ? { touchAction: "none" } : {}),
        },
      ]}
    >
      {!minimize && (
        <>
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

            <TouchableOpacity onPress={onMinimize} style={styles.closeBtn}>
              <AntDesign name="minuscircle" size={22} color={theme.body} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <SuggestCardContainer
              row={row}
              setRows={setLocations}
              suggestContainerType={0}
              schemaActions={AssetsSchemaActions}
              // Dynamically scaled image
              imageScale={scale(imageScale)}
            />
          </View>
        </>
      )}

      {minimize && (
        <TouchableOpacity style={styles.minBtn} onPress={onMinimize}>
          <AntDesign name="pluscircle" size={24} color={theme.body} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 9999,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" ? { cursor: "grab" } : {}),
  },
  dragIcon: {
    flex: 1,
    alignItems: "center",
    marginLeft: 40, // Keeps the minus icon centered relative to the close button
  },
  closeBtn: {
    padding: 10,
  },
  body: {
    flex: 1,
  },
  minBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default MapDrawer;
