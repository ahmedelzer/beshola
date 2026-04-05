import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Heading,
  Button,
  ButtonText,
} from "../../../components/ui"; // or your UI library
import { AntDesign } from "@expo/vector-icons";
import FormContainer from "../../components/form-container/FormContainer";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";

const PopupModal = ({
  haveFooter = true,
  isOpen,
  onClose,
  onSubmit,
  control,
  schema = {},
  errors = {},
  disable = false,
  headerTitle = "Invite your team",
  isFormModal = true,
  footer = null,
  row = {},
  size = null,
  children,
  ...props
}) => {
  
  const localization = useSelector((state) => state.localization.localization);
  const [scrollY, setScrollY] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const width =
        Platform.OS === "web"
          ? window.innerWidth
          : Dimensions.get("window").width;
      setIsSmallScreen(width < 640); // sm breakpoint ~640px
    };

    updateScreenSize();

    if (Platform.OS === "web") {
      window.addEventListener("resize", updateScreenSize);
      return () => window.removeEventListener("resize", updateScreenSize);
    } else {
      const subscription = Dimensions.addEventListener(
        "change",
        ({ window, screen }) => {
          console.log("Window changed", window, screen);
        },
      );

      return () => {
        subscription?.remove(); // ✅ correct
      };
    }
  }, []);
  useEffect(() => {
    if (Platform.OS === "web") {
      const handleScroll = () => {
        setScrollY(window.scrollY || 0);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size || isSmallScreen ? "full" : "md"}
      style={{ overflow: "visible" }}
    >
      <ModalContent
        style={[
          {
            position: "absolute",
            transform: [{ translateX: -0.5 * window.innerWidth }],
          },
        ]}
      >
        <ModalHeader>
          <Heading size="md" className="text-text">
            {headerTitle}
          </Heading>
          <ModalCloseButton>
            <AntDesign name="closecircle" size={24} color="black" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ maxHeight: 400, flex: 1 }}
            horizontal={false} // vertical scroll by default
          >
            {children}

            <PopupModalBody
              control={control}
              errors={errors}
              isFormModal={isFormModal}
              row={row}
              schema={schema}
              isSmallScreen={isSmallScreen}
              {...props}
            ></PopupModalBody>
          </ScrollView>
        </ModalBody>

        {haveFooter && (
          <ModalFooter>
            {footer ? (
              footer
            ) : (
              <View className="flex-row justify-between gap-2">
                <Button
                  isDisabled={disable}
                  variant="outline"
                  action="secondary"
                  onPress={onClose}
                >
                  <ButtonText>{localization.formSteps.popup.cancel}</ButtonText>
                </Button>
                <Button onPress={onSubmit} isDisabled={disable}>
                  <ButtonText>{localization.formSteps.popup.done}</ButtonText>
                </Button>
              </View>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PopupModal;

const PopupModalBody = ({
  children,
  isFormModal,
  schema,
  row,
  errors,
  control,
  isSmallScreen,
  ...props
}) => {
  // Render ScrollView only on small screens
  if (isSmallScreen) {
    return (
      <View
        style={{
          maxHeight: 400, // restrict viewport height
          overflow: "hidden",
        }}
      >
        {/* Vertical scroll */}
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Horizontal scroll with View */}
          <View
            style={{
              // flexDirection: "row",

              overflow: "scroll", // enables horizontal scroll
            }}
          >
            <View className="min-w-80 max-w-full">
              {isFormModal && (
                <FormContainer
                  tableSchema={schema}
                  row={row}
                  shouldDisplayErrorInForm={true}
                  errorResult={errors}
                  control={control}
                  {...props}
                />
              )}
              {children}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // On larger screens just render a normal View
  return (
    <View style={{ maxHeight: 400 }}>
      {isFormModal && (
        <FormContainer
          tableSchema={schema}
          row={row}
          errorResult={errors}
          shouldDisplayErrorInForm={true}
          control={control}
          {...props}
        />
      )}
      {children}
    </View>
  );
};
