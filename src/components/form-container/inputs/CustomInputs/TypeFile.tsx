// ... imports stay the same

import React, { useState } from "react";
import { View, Pressable, Image, Modal, Text } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useSelector } from "react-redux";
import { Button, ButtonText } from "../../../../../components/ui";
import { theme } from "../../../../Theme";

function TypeFile({
  file,
  className = "",
  type = false,
  haveFileStatuesFieldName = false,
  fileStatuesFieldNameValue = true,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const localization = useSelector((state) => state.localization.localization);

  const fileSrc = file;
  const typeFile = type || "";

  // ✅ Determine Circle Color
  const statusColor = !haveFileStatuesFieldName
    ? theme.success
    : fileStatuesFieldNameValue
      ? theme.success
      : theme.error;

  const player = useVideoPlayer(
    typeFile?.startsWith("video") ? { uri: fileSrc } : null,
    (player) => {
      player.loop = false;
    },
  );

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  const renderFileContent = (full = false) => {
    const commonStyle = {
      width: "100%",
      height: full ? "80%" : 150,
      borderRadius: 12,
    };

    if (typeFile?.startsWith("image") || typeFile === "publicImage") {
      return (
        <Image
          source={{ uri: fileSrc }}
          style={commonStyle}
          className={className}
          resizeMode={full ? "contain" : "cover"}
        />
      );
    }

    if (typeFile?.startsWith("video") && player) {
      return (
        <VideoView
          style={commonStyle}
          player={player}
          className={className}
          allowsFullscreen
          contentFit="contain"
        />
      );
    }

    return (
      <View
        style={[
          commonStyle,
          {
            backgroundColor: "#e5e7eb",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: "#6b7280" }}>
          {localization.fileContainer.fileNotSupport}
        </Text>
      </View>
    );
  };

  return (
    <View className="w-full my-2">
      <Pressable onPress={toggleModal} style={{ position: "relative" }}>
        {/* Main Content */}
        {renderFileContent(false)}

        {/* ✅ Status Circle (Bottom-Left Corner) */}
      {haveFileStatuesFieldName&&  <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: statusColor,
            borderWidth: 2,
            borderColor: "white", // Makes it pop against the image
            elevation: 5, // Shadow for Android
            shadowColor: "#000", // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}
        />}
      </Pressable>

      {/* Modal */}
      <Modal visible={modalOpen} animationType="fade" transparent>
        <View className="flex-1 bg-black/90 justify-center items-center p-4">
          {renderFileContent(true)}
          <Button className="mt-8" onPress={toggleModal}>
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </Modal>
    </View>
  );
}

export default TypeFile;
