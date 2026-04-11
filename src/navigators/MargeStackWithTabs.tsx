import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, { Suspense } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { scale } from "react-native-size-matters";
import { useAuth } from "../../context/auth";
import MenuFilter from "../components/filters/MenuFilter";
import HeaderParent from "../components/header/HeaderParent";
import NotificationScreen from "../components/notification/NotificationScreen";
import { WindowWidth } from "../components/shared";
import ForgotPassword from "../kitchensink-components/auth/forgot-password";
import SignIn from "../kitchensink-components/auth/signin";
import SignUp from "../kitchensink-components/auth/signup";
import CartPage from "../kitchensink-components/cart/CartPage";
import CheckoutScreen from "../kitchensink-components/cart/CheckoutScreen";
import { theme } from "../Theme";
import RenderItemsView from "../utils/component/renderItemsView";
import { SetResponsiveContainer } from "../utils/component/SetResponsiveContainer";
import { selectedRoutes } from "../utils/operation/routes";
import { RootStackParamList } from "./RootStack";
import DetailsScreen from "../components/company-components/DetailsScreen";
import ErrorScreen from "../components/privacy/ErrorScreen";
import LoadingScreen from "../kitchensink-components/loading/LoadingScreen";
import CompareScreen from "../kitchensink-components/compare/CompareScreen";
import VerifyScreen from "../kitchensink-components/auth/verfiy";

const Stack =
  Platform.OS === "web" ? createStackNavigator() : createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootStackParamList>();

export const MargeStackWithTabs = (tabItem) => {
  const { userGust } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Only load the route that matches the clicked tab */}
      {selectedRoutes(userGust)
        .routes.filter((r) => r.routePath === tabItem.routePath)
        .map((r) => (
          <Stack.Screen key={r.routePath} name={r.routePath}>
            {(props) => (
              <View style={{ flex: 1 }} className="!bg-body !text-text">
                <View
                  style={[styles.container, { width: WindowWidth - scale(16) }]}
                >
                  <HeaderParent />
                </View>

                <RenderItemsView {...props} routePath={r.routePath} />
              </View>
            )}
          </Stack.Screen>
        ))}

      {/* Shared Screens */}
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen
        name="MenuFilter"
        component={() => SetResponsiveContainer(<MenuFilter />, true)}
      />
      <Stack.Screen name="ErrorScreen" component={ErrorScreen} />

      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen
        name="CheckoutScreen"
        component={() => SetResponsiveContainer(<CheckoutScreen />, true)}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={() => SetResponsiveContainer(<NotificationScreen />, true)}
      />
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(8),
    alignSelf: "center",
    color: theme.text,
    backgroundColor: theme.body,
  },
});
