import React, { useState } from "react";
import { View, Pressable, Image, Modal } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useSelector } from "react-redux";
import { Button, ButtonText } from "../../../../../components/ui";

function TypeFile({ file, title, type = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const localization = useSelector((state) => state.localization.localization);

  const fileSrc = file;
  const typeFile = type || "";

  // ✅ Create player ONLY for video
  const player = useVideoPlayer(
    typeFile?.startsWith("video") ? { uri: fileSrc } : null,
    (player) => {
      player.loop = false;
    },
  );

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // 🔥 Render content
  const renderFileContent = (full = false) => {
    const height = full ? 300 : 150;

    // ✅ IMAGE
    if (typeFile?.startsWith("image") || typeFile === "publicImage") {
      return (
        <Image
          source={{ uri: fileSrc }}
          style={{
            width: "100%",
            height,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
      );
    }

    // ✅ VIDEO (fixed)
    if (typeFile?.startsWith("video") && player) {
      return (
        <VideoView
          style={{
            width: "100%",
            height,
            borderRadius: 12,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      );
    }

    // ✅ DEFAULT
    return (
      <View className="p-4 bg-gray-200 rounded-xl">
        <Button>
          <ButtonText>{localization.fileContainer.fileNotSupport}</ButtonText>
        </Button>
      </View>
    );
  };

  return (
    <View className="w-full">
      {/* Preview */}
      <Pressable onPress={toggleModal}>{renderFileContent(false)}</Pressable>

      {/* Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/90 justify-center p-4">
          <View className="bg-white rounded-2xl p-3">
            {renderFileContent(true)}

            <Button className="mt-4" onPress={toggleModal}>
              <ButtonText>Close</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default TypeFile;
