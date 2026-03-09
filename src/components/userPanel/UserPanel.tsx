import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../../../context/auth";
import { useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import { getField } from "../../utils/operation/getField";
import PersonInfoSchemaActions from "../../Schemas/Profile/PersonInfoSchemaActions.json";
import useFetch, {
  fetchData,
} from "../../../components/hooks/APIsFunctions/useFetch";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../Theme";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "../../../components/ui";

export default function UserPanel({ menuMode }) {
  const navigation = useNavigation();
  const { user, signOut, setProfileInfo, profileInfo } = useAuth();
  const localization = useSelector((state) => state.localization.localization);
  const { signupState } = useSchemas();
  const getAction =
    PersonInfoSchemaActions &&
    PersonInfoSchemaActions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "get",
    );
  const putAction =
    PersonInfoSchemaActions &&
    PersonInfoSchemaActions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "put",
    );
  useEffect(() => {
    const fetch = async () => {
      if (profileInfo == null)
        try {
          const { data } = await fetchData(
            `/${getAction.routeAdderss}`,
            getAction.projectProxyRoute,
          );

          setProfileInfo(data);
        } catch (err) {
          console.error(err);
        }
    };

    fetch();
  }, []);

  // useEffect(() => {
  //   setProfileInfo(profileInfoRes);
  // }, [profileInfoRes]);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const allParams = signupState.schema.dashboardFormSchemaParameters;

  // Get the parameterField values for phoneNumber and confirmPassword
  const firstNameField = getField(allParams, "hidden");
  const [menuVisible, setMenuVisible] = useState(false);

  const navigateToLogin = () => {
    navigation.navigate("SignIn");
  };

  const menuItems = useMemo(
    () => [
      {
        text: user
          ? localization.userPanel.switchAccount
          : localization.Login.loginButton,
        icon: (
          <MaterialCommunityIcons
            name="account-switch-outline"
            size={24}
            className={"text-text"}
          />
        ),
        onPress: navigateToLogin,
      },
      {
        text: localization.Hum_screens.profile.logOut.logOut,
        icon: <Entypo name="log-out" size={24} className={"text-text"} />,
        onPress: signOut,
      },
    ],
    [signOut, user, localization],
  );

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      className="px-4 py-3"
      onPress={() => {
        item.onPress();
        setMenuVisible(false);
      }}
    >
      <View className={`flex flex-row items-center gap-1`}>
        {/* <Entypo name="log-out" size={24} className={"text-body"} /> */}
        {item.icon}
        <Text className={`text-lg truncate`}>{item.text}</Text>
      </View>
      {/* <Text className="text-lg truncate">{item.text}</Text> */}
    </TouchableOpacity>
  );

  return (
    profileInfo && (
      <View className="flex-row items-center flex-grow-0">
        {/* User Info */}
        <TouchableOpacity
          // onPress={() => navigation.navigate("Cart")}
          className="p-2 rounded-lg bg-accent items-center justify-center me-2 relative"
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <View className="">
            <Ionicons
              name="person-circle-outline"
              size={22}
              className="text-body flex-row justify-center items-center"
            />
          </View>
        </TouchableOpacity>

        {/* Menu Modal */}
        <Modal
          isOpen={menuVisible}
          onClose={() => setMenuVisible(false)}
          size={"sm"}
          style={{ overflow: "visible" }}
        >
          <TouchableOpacity
            className="flex-1 bg-overlay size-full justify-center items-center"
            style={{ backgroundColor: theme.overlay }}
            onPress={() => setMenuVisible(false)}
          >
            <View className="bg-body rounded-lg w-48 py-2 shadow-lg">
              <View className="mx-auto">
                <Text className="text-text font-bold text-lg">
                  {profileInfo?.[firstNameField]}
                </Text>
              </View>
              <FlatList
                data={menuItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMenuItem}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  );
}
