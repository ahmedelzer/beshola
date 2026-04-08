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
import React, { useState, useRef } from "react";
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
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 20 });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    // Measure where the button is on the screen
    triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      // Calculate position (showing it below the button)
      const isBottomHalf = pageY > SCREEN_HEIGHT / 2;

      setPopoverPos({
        // If button is at the bottom of the screen, show menu above it
        top: isBottomHalf ? pageY - 120 : pageY + height,
        right: Dimensions.get("window").width - (pageX + width),
      });
      setMenuVisible(true);
    });
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
          className="w-full"
        >
          <StaticButtonInput
            additionClassName={additionClassName}
            withLabel={true}
            fieldName={param.parameterField}
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
          {/* TRIGGER BUTTON */}
          <View ref={triggerRef}>
            <TouchableOpacity onPress={openMenu} style={styles.trigger}>
              <Entypo name="dots-three-vertical" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* RIGHT-CLICK STYLE POPUP */}
          <Modal transparent visible={menuVisible} animationType="fade">
            <Pressable
              style={styles.overlay}
              onPress={() => setMenuVisible(false)}
            >
              <View
                style={[
                  styles.popoverMenu,
                  { top: popoverPos.top, right: popoverPos.right },
                ]}
              >
                <RenderOwnAssetsButtons />
              </View>
            </Pressable>
          </Modal>
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
    backgroundColor: theme.body,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent", // Keep it clear or very light dim
  },
  popoverMenu: {
    position: "absolute",
    backgroundColor: theme.body,
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
    // Shadow for the "floating" effect
    elevation: 8,
    shadowColor: theme.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 0.5,
  },
  menuItem: {
    marginVertical: 2,
    width: "100%",
  },
});
