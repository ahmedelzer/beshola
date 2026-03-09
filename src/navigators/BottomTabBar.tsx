import { MaterialCommunityIcons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React, { FC, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import MenuFilter from "../components/filters/MenuFilter";
import HeaderParent from "../components/header/HeaderParent";
import DetailsScreen from "../components/company-components/DetailsScreen";
import NotificationScreen from "../components/notification/NotificationScreen";
import ForgotPassword from "../kitchensink-components/auth/forgot-password";
import SignIn from "../kitchensink-components/auth/signin";
import SignUp from "../kitchensink-components/auth/signup";
import CartPage from "../kitchensink-components/cart/CartPage";
import CheckoutScreen from "../kitchensink-components/cart/CheckoutScreen";
import { theme } from "../Theme";
import RenderItemsView from "../utils/component/renderItemsView";
import { SetResponsiveContainer } from "../utils/component/SetResponsiveContainer";
import { getTabBarVisibility } from "../utils/operation/getTabBarVisibility";
import { RootStackParamList } from "./RootStack";
import { selectedRoutes } from "../utils/operation/routes";
import { useAuth } from "../../context/auth";
import { scale } from "react-native-size-matters";
const Stack =
  Platform.OS === "web" ? createStackNavigator() : createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Define the TestStack with HomeScreen and CartPage
//!localization
const BottomBarTabs: FC = () => {
  const { userGust, setUser } = useAuth();
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );
  // const homeIcon = ({ color }: { focused: boolean; color: string }) => (
  //   <Icon as={Home} size="lg" color={color} />
  // );
  // const accountIcon = ({ color }: { focused: boolean; color: string }) => (
  //   <Icon as={User} size="lg" color={color} />
  // );
  // const messageIcon = ({ color }: { focused: boolean; color: string }) => (
  //   <Icon as={Mail} size="lg" color={color} />
  // );
  // const menuIcon = ({ color }: { focused: boolean; color: string }) => (
  //   <Icon as={Menu} size="lg" color={color} />
  // );
  const homeIcon = ({ color }: { focused: boolean; color: string }) => (
    <MaterialCommunityIcons name="home" size={24} color={color} />
  );
  const accountIcon = ({ color }: { focused: boolean; color: string }) => (
    <MaterialCommunityIcons name="account" size={24} color={color} />
  );
  const messageIcon = ({ color }: { focused: boolean; color: string }) => (
    <MaterialCommunityIcons name="email" size={24} color={color} />
  );
  const menuIcon = ({ color }: { focused: boolean; color: string }) => (
    <MaterialCommunityIcons name="menu" size={24} color={color} />
  );
  const marketPlaceIcon = ({ color }: { focused: boolean; color: string }) => (
    <Fontisto name="shopping-store" size={24} color={color} />
  );

  const MargeStackWithTabs = (item) => {
    function RenderComponent() {
      return (
        <RenderItemsView
          dashboardItemId={item.dashboardItemID}
          routePath={item.routePath}
        />
      );
    }
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Rendered Item View Screen */}
        {/* <Stack.Screen
          options={
            item.routePath !== "Profile" && {
              headerShown: true,
              headerTitle: () => <HeaderParent />,
              headerStyle: {
                backgroundColor: theme.dark_card, // Set your custom color here
                elevation: 0, // Remove shadow on Android
                shadowOpacity: 0, // Remove shadow on iOS
              },
              headerLeftContainerStyle: {
                paddingLeft: 0,
                marginLeft: 0,
              },
              headerTitleContainerStyle: {
                paddingLeft: 0,
                marginLeft: 0,
              },
            }
          }
          name={item.routePath}
          component={RenderComponent}
        /> */}
        {selectedRoutes(userGust).routes.map((item) => (
          <Stack.Screen
            key={item.routePath}
            name={item.routePath}
            options={{ headerShown: false }}
          >
            {(props) => {
              // console.log(selectedRoutes(userGust).routes);
              return (
                <View style={{ flex: 1 }} className="!bg-body !text-text">
                  <View
                    style={[
                      styles.container,
                      { width: windowWidth - scale(16) },
                    ]}
                  >
                    <HeaderParent />
                  </View>
                  <RenderItemsView {...props} routePath={item.routePath} />
                </View>
              );
            }}
          </Stack.Screen>
        ))}

        {/* Cart Screen */}
        <Stack.Screen
          name="Cart"
          component={() => SetResponsiveContainer(<CartPage />, true)}
        />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
        <Stack.Screen
          name="MenuFilter"
          component={() => SetResponsiveContainer(<MenuFilter />, true)}
        />
        <Stack.Screen name="DetailsProductScreen" component={DetailsScreen} />
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

  const SetOptions = (item) => {
    switch (item.routePath) {
      case "Home":
      case "dynamicMenuItemsView":
        return {
          headerShown: false,
          // tabBarIconName: homeIcon,
          tabBarIcon: homeIcon,

          // headerTitle: () => <HeaderParent />,
        };
      case "Profile":
        return {
          headerShown: false,
          tabBarIcon: accountIcon,
        };
      case "marketPlace":
        return {
          headerShown: false,
          tabBarIcon: marketPlaceIcon,
        };
      default:
        return {
          headerShown: false,
          tabBarIcon: menuIcon,
        };
    }
  };

  return (
    <Tab.Navigator
      id={undefined}
      tabBarPosition="right"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.surface, // Dark blue-gray background
        },
        tabBarActiveTintColor: theme.accent, // Bright yellow for active tab text/icon
        tabBarInactiveTintColor: theme.primary, // Light gray for inactive tab text/icon
      }}
    >
      {selectedRoutes(userGust).routes.map((item: any) => (
        <Tab.Screen
          key={item.routePath}
          name={item.routePath}
          options={({ route }) => {
            // Get visibility status of the tab (e.g., hide tab bar for some screens)
            const visibility = getTabBarVisibility(route);

            // Get tab-specific options from a centralized function
            const options = SetOptions(item);

            // This is the icon that must always be displayed
            const SelectedIcon = options.tabBarIcon;

            return {
              ...options,

              // Customize how the tab icon is rendered
              tabBarIcon: ({ focused, color, size }) => (
                <View style={{ alignItems: "center" }}>
                  {/* Show a top border when the tab is focused */}
                  {focused && (
                    <View
                      style={{
                        width: 30,
                        height: 3,
                        backgroundColor: theme.accent,
                        borderRadius: 2,
                        marginBottom: 4,
                      }}
                    />
                  )}
                  {/* Render the icon returned from SetOptions */}
                  {
                    <SelectedIcon
                      color={focused ? theme.accent : theme.primary}
                    />
                  }
                </View>
              ),

              // Customize the tab bar style
              tabBarStyle: [
                {
                  backgroundColor: theme.body, // Set tab bar background
                },
                visibility === "none" && { display: "none" }, // Conditionally hide tab bar
              ],
            };
          }}
        >
          {() => {
            // if (item.routePath === "test") {
            //   return <TestStack />;
            // }
            return MargeStackWithTabs(item);
          }}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(8),
    marginLeft: "auto",
    marginRight: "auto",
    color: theme.text,
    backgroundColor: theme.body,
  },
});
export default BottomBarTabs;
