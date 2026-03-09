import React, { FC } from "react";
// react navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Chase } from "react-native-animated-spinkit";
import { useAuth } from "../../context/auth";
import LoadingScreen from "../kitchensink-components/loading/LoadingScreen";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import BottomBarTabs from "./BottomTabBar";
import OutsideStack from "./OutSideStack";
import SplashNavigation from "./SplashNavigation";
import WebNavigator from "./AppNavigator";
// import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import AppNavigator from "./AppNavigator";
import { CompareProvider } from "../../context/CompareProvider";
import AssetsForm from "../components/addAsset/AssetsForm";
// types
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Rooms: undefined;
  GatesView: undefined;
  LiveGateView: undefined;
  LiveGateStack: undefined;
  LiveChatView: undefined;
  MenuView: undefined;
  UserProfile: undefined;
  Messages: undefined;
  RoomsView: undefined;
};
``;
//todo: make with pixel rexio padding or margin top with  platforms
const linking = {
  prefixes: [Linking.createURL("/"), "https://your-app.web.app"],
  config: {
    screens: {
      Home: "",
      Profile: "profile", // ensure `userId` is passed
      Cart: "cart",
      Search: "search",
      SignIn: "signin",
      SignUp: "signup",
      Verify: "Verify",
      Requests: "requests",
      MenuFilter: "filters",
      ForgetPassword: "forget-password",
      CompareScreen: "compare",
      NotificationScreen: "notifications",
      CheckoutScreen: "checkout",
      MyAssets: "MyAssets",
      DetailsProductScreen: "property/:id", // if using dynamic products
    },
  },
};

const Stack = createStackNavigator<RootStackParamList>();
const RootStack: FC = (props: any) => {
  return (
    <NavigationContainer linking={linking}>
      <CompareProvider>{RequiredScreens()}</CompareProvider>
    </NavigationContainer>
  );
};
const RequiredScreens = () => {
  const { user, hasOnboarded, loading } = useAuth();
  const { os } = useDeviceInfo();
  if (loading) {
    return <LoadingScreen />;
  }
  const mobileScreens = () => {
    if (!hasOnboarded) {
      return <SplashNavigation />;
    } else if (user) {
      return <AppNavigator />;
    } else {
      return <AppNavigator />;
    }
  };
  const webScreens = () => {
    if (!hasOnboarded) {
      return <SplashNavigation />;
    } else {
      return <AppNavigator />;
    }
  };
  switch (os) {
    case "android":
    case "ios":
    case "windows":
    case "macos":
      return mobileScreens();
    case "web":
      return webScreens();
  }
};
export default RootStack;
