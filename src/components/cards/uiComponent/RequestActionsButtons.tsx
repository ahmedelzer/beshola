import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import StaticButtonInput from "../../form-container/inputs/StaticButtonInput";
import { CreateInputProps } from "../../form-container/CreateInputProps";
import RequestSchema from "../../../Schemas/MenuSchema/RequestSchema.json";
import RequsetTimeSchema from "../../../Schemas/MenuSchema/RequsetTimeSchema.json";
import RequsetTimeSchemaActions from "../../../Schemas/MenuSchema/RequsetTimeSchemaActions.json";
import { HStack } from "../../../../components/ui";
import { theme } from "../../../Theme";
import { AntDesign, Entypo } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RequestActionsButtons({
  item,
  styleType = "menuPopup",
  additionClassName = "",
}: {
  item: any;
  styleType?: string;
  additionClassName?: string;
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [child, setChild] = useState<React.ReactNode | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  // 1. Function receiving position directly from the click event
  const openMenu = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setChild(null);
    const menuWidth = 160;
    const menuHeight = 130; // Estimated height for 2-3 buttons
    const isBottomHalf = pageY > SCREEN_HEIGHT / 2;

    setPopoverPos({
      // If at the bottom, shift the menu UP by its height
      top: isBottomHalf ? pageY - menuHeight : pageY + 5,
      // Align right edge of menu with the touch point
      left: pageX - menuWidth + 20,
    });

    setMenuVisible(true);
  };

  const ownSchemaWithButtonOnlyParameters = {
    ...RequestSchema,
    dashboardFormSchemaParameters:
      RequestSchema.dashboardFormSchemaParameters.filter(
        (pram) => pram.parameterType === "detailsCell",
      ),
  };

  const RenderOwnAssetsButtons = () => {
    return ownSchemaWithButtonOnlyParameters.dashboardFormSchemaParameters
      .filter(
        (column: any) =>
          !column.isIDField &&
          column.isEnable &&
          !column.parameterType.startsWith("hidden"),
      )
      .map((param: any) => (
        <View
          key={param.parameterField}
          style={
            styleType === "menuPopup"
              ? styles.menuItem
              : { width: "100%", flex: 1 }
          }
        >
          <StaticButtonInput
            additionClassName={additionClassName}
            withLabel={true}
            fieldName={param.parameterField}
            setChild={setChild}
            schema={RequsetTimeSchema}
            rowDetails={item}
            _schemaActions={RequsetTimeSchemaActions}
            {...CreateInputProps(param, {})}
          />
        </View>
      ));
  };

  return (
    <HStack
      alignItems="center"
      justifyContent="between"
      style={{ width: "100%", gap: 12 }}
    >
      <TouchableOpacity style={styles.chatButton}>
        <AntDesign name="wechat" size={22} color={theme.body} />
      </TouchableOpacity>

      {styleType === "scroll" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={`border ${additionClassName} p-1 rounded-lg`}
          contentContainerStyle={{ width: "100%" }}
        >
          <RenderOwnAssetsButtons />
        </ScrollView>
      ) : (
        <>
          {/* TRIGGER BUTTON - PASSING EVENT */}
          <TouchableOpacity
            className={`border ${additionClassName} p-1 rounded-lg`}
            onPress={(e) => openMenu(e)}
            style={styles.trigger}
          >
            <Entypo name="dots-three-vertical" size={20} color={theme.body} />
          </TouchableOpacity>

          {/* DYNAMIC POPUP MENU */}
          {child ? (
            child
          ) : (
            <Modal transparent visible={menuVisible} animationType="fade">
              <Pressable
                style={styles.overlay}
                onPress={() => setMenuVisible(false)}
              >
                <View
                  style={[
                    styles.popoverMenu,
                    {
                      top: popoverPos.top,
                      left: popoverPos.left,
                    },
                  ]}
                >
                  <RenderOwnAssetsButtons />
                </View>
              </Pressable>
            </Modal>
          )}
        </>
      )}
    </HStack>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    backgroundColor: theme.accent,
    padding: 8,
    borderRadius: 999,
  },
  trigger: {
    padding: 8,
    backgroundColor: theme.accent,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  popoverMenu: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
    minWidth: 160,
    // Elevation/Shadow to match your image
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  menuItem: {
    marginVertical: 4,
    width: "100%",
  },
});
