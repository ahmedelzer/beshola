import { useSelector } from "react-redux";

export function selectedRoutes(userGust: boolean) {
  const localization = useSelector(
    (state: any) => state.localization.localization,
  );

  const routes = [
    { routePath: "Home" },
    { routePath: "Search" },
    { routePath: "Requests" },
    { routePath: "MyAssets" },
    { routePath: "Profile" },
  ];
  const staticTabs = [
    { routePath: "Home", icon: "home" },
    { routePath: "Search", icon: "menu" },
    { routePath: "Requests", icon: "receipt" },
    { routePath: "MyAssets", icon: "inventory-2" }, // extra ثابت
    { routePath: "Profile", icon: "person" },
  ];
  // Create new mapped tabs with routePath added
  const tabs = staticTabs.map((tab) => {
    const localized = localization.tabs?.find((t: any) => t.icon === tab.icon);

    return {
      ...tab,
      name: localized?.name || tab.routePath, // fallback if missing
    };
  });
  const routesForGuests = routes.filter(
    (item) =>
      item.routePath !== "Profile" &&
      item.routePath !== "Requests" &&
      item.routePath !== "MyAssets",
  );

  const tabsForGuests = tabs.filter(
    (item) =>
      item.routePath !== "Profile" &&
      item.routePath !== "Requests" &&
      item.routePath !== "MyAssets",
  );

  return userGust
    ? { routes: routesForGuests, tabs: tabsForGuests }
    : { routes, tabs };
}
