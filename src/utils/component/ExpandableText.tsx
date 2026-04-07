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
  fontSize = 14
}: {
  text: string;
  initLimit?: number;
  className?: string;
  expandClass?: string;
  fontSize?: number;
}) => {
  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  // Apply fontSize to the short version
  if (text.length <= initLimit)
    return <Text style={{ fontSize }} className={className}>{text}</Text>;

  return (
    <View>
      <Text style={{ fontSize }} className={className} numberOfLines={1}>
        {text.substring(0, initLimit)}
        <Text
          onPress={openModal}
          // Combined the underline with the dynamic fontSize
          style={{ textDecorationLine: "underline", fontSize }} 
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
            {/* Applied fontSize to the full text inside the modal as well */}
            <Text style={{ fontSize }} className="text-base">{text}</Text>
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