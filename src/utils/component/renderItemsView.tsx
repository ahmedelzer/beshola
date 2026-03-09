import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import SearchView from "../../components/company-components/SearchView";
import HomePage from "../../kitchensink-components/HomestayPage";
import MobileProfilePage from "../../kitchensink-components/profile/MobileProfilePage";
import { updateCurrentLocation } from "../../reducers/LocationReducer";
import { SetResponsiveContainer } from "../component/SetResponsiveContainer";
import { GetCard } from "../operation/GetCard";
import { requestLocationPermission } from "./requestLocationPermission";
import RequestsScreen from "../../kitchensink-components/orders/RequestsScreen";
import AssetsForm from "../../components/addAsset/AssetsForm";
const RenderItemsView = ({ routePath }: any) => {
  const { menuItemsState } = useSchemas();
  console.log("====================================");
  console.log(routePath, "routePath");
  console.log("====================================");
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const total = useSelector((state) => state.cart.totalAmount);

  useEffect(() => {
    // if (GetCustomerCart) {
    //   GetCard(menuItemsState.schema, GetCustomerCart, dispatch, cart, total);
    // }
    GetCard(menuItemsState.schema, null, dispatch, cart, total);
  }, []);
  useEffect(() => {
    const getAndSetLocation = async () => {
      const coords = await requestLocationPermission();
      if (coords) {
        dispatch(updateCurrentLocation(coords));
      }
    };

    getAndSetLocation();
  }, []);
  // if (isLoading || !GetCustomerCart) {
  //   console.log(isLoading, GetCustomerCart, error);

  //   return <LoadingScreen LoadingComponent={<Chase size={40} />} />;
  // }
  switch (routePath) {
    case "Search":
      return SetResponsiveContainer(
        <SearchView />,

        true,
      );
    case "Home":
      return SetResponsiveContainer(<HomePage />, true);
    case "Profile":
      return SetResponsiveContainer(<MobileProfilePage />, true);
    case "Requests":
      return SetResponsiveContainer(<RequestsScreen />, true);
    case "MyAssets":
      return SetResponsiveContainer(<AssetsForm />, true);
    default:
      return <HomePage />;
  }
};

export default RenderItemsView;
