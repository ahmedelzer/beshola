import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { theme } from "../../Theme";
import ExpandableText from "../../utils/component/ExpandableText";
import PopupModal from "../../utils/component/PopupModal";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import PolygonMapEmbed from "../maps/DrawSmoothPolygon";

const AddressComponent = ({ addressText, item, fieldsType }) => {
  const [labelWidth, setLabelWidth] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dynamicWidth = getDynamicWidth(addressText);

  // Logic: Calculate how many characters fit in the current labelWidth.
  // We subtract space for the icon (~20px) and padding (~16px).
  // Assuming a character width of approx 7-8 pixels for 'text-xs'.
  const availableTextSpace = Math.max(0, labelWidth - 36);
  const calculatedLimit = Math.floor(availableTextSpace / 7.5);
  const onPress = () => {};

  return (
    <View
      onLayout={(e) => {
        setLabelWidth(e.nativeEvent.layout.width);
      }}
      style={{ width: dynamicWidth, maxWidth: "100%", flexShrink: 1 }}
    >
      <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        // onSubmit={async () => {
        //   handleSubmit(onSubmit);
        // }}
        isFormModal={false}
        headerTitle={addressText}
        row={{}}
      >
        <PolygonMapEmbed
          location={{
            [fieldsType.latitude]: item[fieldsType.latitude],
            [fieldsType.longitude]: item[fieldsType.latitude],
          }}
          fields={fieldsType.parameters}
          onLocationChange={() => {}}
          setNewPolygon={() => {}}
        />
      </PopupModal>
      <TouchableOpacity
        onPress={() => {
          console.log("====================================");
          console.log("pressing");
          console.log("====================================");
          setIsModalVisible(true);
        }}
        activeOpacity={0.8}
        style={{
          backgroundColor: theme.accentHover,
          borderWidth: 1,
          borderColor: theme.accentHover,
          borderRadius: 5,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 4,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={14}
          color={theme.accent}
        />

        <View style={{ flex: 1, marginLeft: 4 }}>
          <ExpandableText
            text={addressText}
            expandClass="text-md text-secondary font-bold"
            // Now the limit is determined by the actual View width
            initLimit={calculatedLimit > 0 ? calculatedLimit : 15}
            className="text-body text-xs font-medium"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddressComponent;
