import { useState } from "react";
import { Text, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  ButtonText,
} from "../../../components/ui";

const ExpandableText = ({
  text,
  initLimit = 100,
  className = "",
  expandClass = "text-md text-accentHover font-bold",
}: {
  text: string;
  initLimit?: number;
  className?: string;
  expandClass?: string;
}) => {
  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  if (text.length <= initLimit)
    return <Text className={className}>{text}</Text>;

  return (
    <View>
      <Text className={className} numberOfLines={1}>
        {text.substring(0, initLimit)}
        <Text
          onPress={openModal}
          style={{ textDecorationLine: "underline" }} // Added the underline here
          className={expandClass}
        >
          ...#
        </Text>
      </Text>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-lg font-bold">Details</Text>
          </ModalHeader>
          <ModalBody>
            <Text className="text-base">{text}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onPress={closeModal}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default ExpandableText;
