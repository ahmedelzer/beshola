import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
// Assuming you move your styles to a StyleSheet or keep them in a separate file
import { imageInputStyle } from "./styles";
import convertImageToBase64 from "./InputActions/ConvertImageToBase64";
import Animated from "react-native-reanimated";
import AddMediaCard from "../../cards/AddMediaCard";

// Fallback if the asset path differs in Native
const defaultImage = require("./../../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg");
const ImageParameter = (props) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [base64, setIsBase64] = useState(null);
  const { fieldName, value, actions, title } = props;
  // Logic to handle image conversion
  const handleImageChange = async () => {
    if (value && value !== props.defaultValue) {
      try {
        // Note: convertImageToBase64 must be compatible with React Native (using fetch or fs)
        const b64 = await convertImageToBase64(value);
        setIsBase64(b64);
      } catch (error) {
        console.error("Failed to convert image to Base64:", error);
      }
    }
  };

  useEffect(() => {
    handleImageChange();
  }, [value]);

  // Mobile doesn't have "hover", so we toggle the overlay on press
  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const imageAltValue = "Image";
  console.log("====================================");
  console.log(value, "value value");
  console.log("====================================");
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleOverlay}
        onHoverIn={toggleOverlay}
        onHoverOut={() => console.log("hover out")}
        style={styles.imageWrapper}
      >
        {/* <Animated.Image
          source={value ? { uri: value } : defaultImage}
          style={[styles.image, props.imageStyle]}
          accessibilityLabel={imageAltValue}
        /> */}
        <AddMediaCard
          source={Object.keys(value).length > 1 ? { uri: value } : defaultImage}
          customStyle={[styles.image, props.imageStyle]}
        />

        {/* Action Overlay (Replaces Hover) */}
        {showOverlay && (
          <View style={styles.hoverOverlay}>
            {actions?.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                {action}
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Note: React Native doesn't use <input type="hidden">. 
        You should pass the 'base64' state back to the parent via a callback 
        like props.onValueChange(base64) 
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 10,
  },
  imageWrapper: {
    width: 200, // Adjust based on your needs
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  hoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  actionItem: {
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});

export default ImageParameter;
