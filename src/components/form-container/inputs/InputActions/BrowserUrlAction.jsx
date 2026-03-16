import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  Box,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Pressable,
  Spinner,
} from "../../../../../components/ui";

const BrowserUrlAction = ({ onImageUpload }) => {
  const localization = useSelector((state) => state.localization.localization);

  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!localization) return null;

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setError("");
    setImageUrl("");
  };
  const validateAndFetch = async () => {
    // try {
    //   const response = await fetch(imageUrl);
    //   if (response.ok) {
    //     const contentType = response.headers.get("content-type");
    //     if (contentType && contentType.startsWith("image")) {
    //       const blob = await response.blob();
    //       this.props.onImageUpload(URL.createObjectURL(blob), blob.type);
    //       this.toggleModal();
    //     } else {
    //       // this.setState({ error: localization.browser.error.notImage });
    //       setError(localization.browser.error.notImage);
    //     }
    //   } else {
    //     setError(
    //       localization.browser.error.fetchFailed.replace(
    //         "{status}",
    //         response.status,
    //       ),
    //     );
    //   }
    // } catch (error) {
    //   setError(localization.browser.error.fetchError);
    // }
    onImageUpload(imageUrl, "image");
  };
  // const validateAndFetch = async () => {
  //   try {
  //     new URL(imageUrl);
  //   } catch {
  //     setError(localization.browser.error.invalidUrl);
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch(imageUrl);
  //     console.log("====================================");
  //     console.log(imageUrl, response, "imageUrl, response,");
  //     console.log("====================================");
  //     if (response.ok) {
  //       const contentType = response.headers.get("content-type");

  //       if (contentType?.startsWith("image")) {
  //         onImageUpload(imageUrl, contentType);
  //         toggleModal();
  //       } else {
  //         setError(localization.browser.error.notImage);
  //       }
  //     } else {
  //       setError(
  //         localization.browser.error.fetchFailed.replace(
  //           "{status}",
  //           response.status,
  //         ),
  //       );
  //     }
  //   } catch {
  //     setError(localization.browser.error.fetchError);
  //   }

  //   setLoading(false);
  // };

  return (
    <>
      <Pressable onPress={toggleModal}>
        <Ionicons name="link-outline" size={24} color="#555" />
      </Pressable>

      <Modal isOpen={modalOpen} onClose={toggleModal}>
        <ModalBackdrop />

        <ModalContent className="w-[90%] max-w-md rounded-2xl">
          <ModalHeader>
            <Text className="text-lg font-bold">
              {localization.browser.modal.header}
            </Text>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <VStack space="md">
              <Input variant="outline">
                <InputField
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder={localization.inputs.image.UrlPlaceholder}
                  autoCapitalize="none"
                  keyboardType="url"
                  autoCorrect={false}
                />
              </Input>

              {error && <Text className="text-red-500 text-sm">{error}</Text>}
            </VStack>
          </ModalBody>

          <ModalFooter className="flex-row justify-between">
            <Button variant="outline" onPress={toggleModal}>
              <ButtonText>
                {localization.browser.modal.button.cancel}
              </ButtonText>
            </Button>

            <Button
              onPress={validateAndFetch}
              isDisabled={!imageUrl || loading}
            >
              {loading ? (
                <Spinner />
              ) : (
                <ButtonText>
                  {localization.browser.modal.button.fetch}
                </ButtonText>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BrowserUrlAction;
