import { useSelector } from "react-redux";
import { AddItemToCart } from "./AddItemToCart";
import { useAuth } from "../../../context/auth";
import { store } from "../../store/reduxStore";

export async function UpdateCart(
  quantityChange,
  itemPackage,
  fieldsType,
  setLoading,
  schemaActions,
  setNotifications,
) {
  const orderStatus = store.getState().location.orderStatus;
  const localization = store.getState().localization.localization;

  if (!itemPackage || !fieldsType?.cardAction) return;
  if (orderStatus === "closed") {
    setNotifications([
      {
        mess: localization.Hum_screens.home.notify.branchClosed,
        status: "error",
      },
    ]);
    return; // stop cart update if closed
  }

  if (orderStatus === "nearClosed") {
    setNotifications([
      {
        mess: localization.Hum_screens.home.notify.branchNearClosed,
        status: "warning",
      },
    ]);
  }
  setLoading(true);
  try {
    const newQuantity =
      (itemPackage?.[fieldsType.cardAction] ?? 0) + quantityChange;

    if (newQuantity < 0) {
      setLoading(false);
      return; // Prevent negative quantity
    }

    await AddItemToCart(
      { ...itemPackage, [fieldsType.cardAction]: newQuantity },
      setLoading,
      fieldsType,
      schemaActions,
      newQuantity,
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    setLoading(false);
  }
}
