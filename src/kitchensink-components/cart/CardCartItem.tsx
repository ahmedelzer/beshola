import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { moderateScale, scale } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import ImageCardActions from "../../components/cards/ImageCardActions";
import { theme } from "../../Theme";
import CardPriceDiscount from "../../utils/component/CardPriceDiscount";
import InputWithAction from "../../utils/component/InputWithAction";
import PopupModal from "../../utils/component/PopupModal";
import { RenderDeleteAction } from "../../utils/component/renderDeleteAction";
import DeleteItem from "../../utils/operation/DeleteItem";
import FieldAction from "../../utils/operation/FieldAction";
import { getPaddedText } from "../../utils/operation/getPaddedText";
import { AddToCartSecondaryButton } from "./AddToCartButton";
import { addToCart, removeCartItem } from "../../reducers/CartReducer";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import { isRTL } from "../../utils/operation/isRTL";
import { useAuth } from "../../../context/auth";
import { useSchemas } from "../../../context/SchemaProvider";
import { useCart } from "../../../context/CartProvider";
// import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
export default function CardCartItem({ fieldsType, schemaActions, item }) {
  const localization = useSelector((state) => state.localization.localization);
  const { setNotifications } = useAuth();
  const { cartReducerDispatch, cartState } = useCart();
  const notify = localization.Hum_screens.cart.notify;

  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const imageSize = getResponsiveImageSize(0.3, { min: 80, max: 120 });
  const delAction =
    schemaActions &&
    schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Delete",
    );
  const fieldName = fieldsType.note;
  const putAction =
    schemaActions &&
    schemaActions.find(
      (action) => action.dashboardFormActionMethodType === `${fieldName}:Put`,
    );
  const onSubmitFun = async (value) => {
    const customerCartItemID = item[fieldsType.idField];

    const req = await FieldAction(customerCartItemID, value, putAction);
    if (req && req.success === true) {
      setNotifications([{ mess: notify.cardCartNoteAdded }]);

      setModalOpen(false);
    } else {
      setNotifications([
        { mess: notify.cardCartNoteAddedError, status: "error" },
      ]);
    }
  };
  const removeCard = async () => {
    const req = await DeleteItem(
      item[fieldsType.idField],
      true,
      delAction,
      fieldsType.proxyRoute,
    );
    if (req) {
      setNotifications([{ mess: notify.cardCartRemoved }]);
      setModalOpen(false);
      const idField = fieldsType.idField;
      const removeFromCart = cartState.rows.filter(
        (removeItem) => removeItem[idField] !== item[idField],
      );
      cartReducerDispatch({
        type: "WS_OPE_ROW",
        payload: {
          rows: removeFromCart,
          totalCount: removeFromCart.length,
        },
      });
    } else {
      setNotifications([
        {
          mess: notify.cardCartRemovedError,
          status: "error",
        },
      ]);
    }
  };
  const [isSwiped, setIsSwiped] = useState(false);
  return (
    <View className="rounded-xl overflow-hidden !bg-dark_card" id="100">
      <Swipeable
        onSwipeableOpen={() => setIsSwiped(true)}
        onSwipeableClose={() => setIsSwiped(false)}
        renderRightActions={
          !isRTL()
            ? (progress, dragX) =>
                RenderDeleteAction(progress, dragX, removeCard)
            : null
        }
        renderLeftActions={
          isRTL()
            ? (progress, dragX) =>
                RenderDeleteAction(progress, dragX, removeCard)
            : null
        }
      >
        {/* Main Content Container */}
        <View>
          {/* Card Body */}
          <View
            key={item[fieldsType.idField]}
            className="flex flex-row flex-1 items-center justify-between relative !bg-dark_card rounded-xl p-3"
          >
            {/* Image Section */}
            <View className="p-2 py-1">
              <ImageCardActions
                fieldsType={fieldsType}
                item={item}
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: moderateScale(20),
                }}
                className="size-[80%] md:!size-52"
                showFaovertIcon={false}
              />
            </View>

            {/* Text Content Section */}
            <View className="ml-4 flex-1 items-start justify-between">
              {/* Title Row */}
              <View className="flex-row w-full items-center justify-between">
                {item[fieldsType.text] && (
                  <Text
                    className="font-semibold text-lg text-surface"
                    numberOfLines={2}
                    key={`${item[fieldsType.idField]}-${fieldsType.text}-${
                      item[fieldsType.text]
                    }`}
                  >
                    {item[fieldsType.text]}
                  </Text>
                )}
              </View>

              {/* Description Row */}
              <Text className="text-sm text-primary-custom">
                {getPaddedText(item[fieldsType.description] ?? "", 3)}
              </Text>

              {/* Price Row */}
              <View className="w-full flex flex-col justify-between items-start">
                <CardPriceDiscount fieldsType={fieldsType} item={item} />
              </View>

              {/* Action Buttons Row */}
              {item[fieldsType.cardAction] && schemaActions && (
                <View className="flex flex-row justify-between w-full">
                  <AddToCartSecondaryButton
                    itemPackage={item}
                    fieldsType={fieldsType}
                    schemaActions={schemaActions}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Combined Note & Edit Button Row */}
          <View className="items-center">
            <View className="flex-row items-center justify-between bg-note px-3 !bg-dark_card mt-2 w-[90%]">
              {/* Note Text - takes up available space */}
              <View className="flex-1 py-2">
                <Text
                  className="text-text !bg-body text-lg rounded-md"
                  key={`${item[fieldsType.idField]}-${fieldsType.note}-${
                    item[fieldsType.note]
                  }`}
                >
                  {item[fieldsType.note]}
                </Text>
              </View>

              {/* Edit Button - fixed on right side */}
              <TouchableOpacity
                className="bg-accentHover p-2 rounded-lg ms-2"
                onPress={setModalOpen}
              >
                <FontAwesome name="edit" size={20} className="!text-body" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Edit Note Modal */}
          {putAction && (
            <PopupModal
              haveFooter={false}
              isOpen={modalOpen}
              onSubmit={() => {}}
              onClose={() => setModalOpen(false)}
              headerTitle={localization.Hum_screens.cart.note.header}
              isFormModal={false}
            >
              <View>
                <InputWithAction
                  placeholder={localization.Hum_screens.cart.note.placeHolder}
                  submitButtonText={localization.Hum_screens.cart.submitButton}
                  onSubmitFun={onSubmitFun}
                  inputType="textarea"
                />
              </View>
            </PopupModal>
          )}
        </View>
      </Swipeable>
    </View>
  );
}
