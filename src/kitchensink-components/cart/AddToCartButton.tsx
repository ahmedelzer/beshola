import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../context/auth";
import { AddItemToCart } from "./AddItemToCart";
import { useSelector } from "react-redux";
import { useDisplayToast } from "../../components/form-container/ShowToast";
import { useNetwork } from "../../../context/NetworkContext";
import { theme } from "../../Theme";
import { UpdateCart } from "./UpdateCart";

const AddToCartSecondaryButton = ({
  itemPackage,
  fieldsType,
  schemaActions,
}) => {
  // const { quantity, updateCart } = useCartItemHandler(itemPackage, fieldsType);
  const [item, setItem] = useState(itemPackage);
  const [loading, setLoading] = useState(false);
  const { showToast } = useDisplayToast();
  const { isOnline, checkNetwork } = useNetwork();
  const { user, setNotifications } = useAuth();

  return (
    <DisplayButton fieldsType={fieldsType} itemPackage={itemPackage}>
      <View className="flex-row items-center mt-2">
        <TouchableOpacity
          onPress={async () => {
            await UpdateCart(
              1,
              itemPackage,
              fieldsType,
              setLoading,
              schemaActions,
              setNotifications,
            );
          }}
          className="mt-2 px-2 py-1 rounded-lg bg-accent items-center justify-center flex flex-row"
        >
          <Feather name="plus" size={25} className="!text-body" />
        </TouchableOpacity>
        <Text
          key={`${item?.[fieldsType.idField]}-${fieldsType.cardAction}-${itemPackage?.[fieldsType.cardAction] ?? 0}`}
          className="mx-2 sm:mx-4 mt-2 flex flex-row justify-center w-10 items-center text-lg text-body px-2 py-1 rounded-lg !border-accent"
          style={{ borderWidth: 2, borderColor: theme.accent }}
        >
          {itemPackage?.[fieldsType.cardAction] ?? 0}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await UpdateCart(
              -1,
              itemPackage,
              fieldsType,
              setLoading,
              schemaActions,
              setNotifications,
            );
          }}
          className="mt-2 px-2 py-1 rounded-lg bg-accent items-center justify-center flex flex-row"
        >
          <Feather name="minus" size={25} className="!text-body" />
        </TouchableOpacity>
      </View>
    </DisplayButton>
  );
};

const AddToCartPrimaryButton = ({
  itemPackage = {},
  fieldsType = {},
  isSuggest = false,
  schemaActions,
}) => {
  const { user, setNotifications } = useAuth();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(itemPackage);
  const localization = useSelector((state) => state.localization.localization);
  const { showToast } = useDisplayToast();
  const { isOnline, checkNetwork } = useNetwork();
  // Update local item state whenever itemPackage changes (e.g. from WS update)

  // Current quantity based on cardAction field
  //const quantity = itemPackage?.[fieldsType.cardAction] ?? 0;

  if (isSuggest) {
    const [isAdded, setIsAdded] = useState(
      itemPackage[fieldsType.cardAction] &&
        itemPackage[fieldsType.cardAction] > 0
        ? true
        : false,
    );
    useEffect(() => {
      setIsAdded(itemPackage[fieldsType.cardAction] > 0 ? true : false);
    }, [itemPackage[fieldsType.cardAction]]);
    return (
      <TouchableOpacity
        onPress={async () => {
          await UpdateCart(
            1,
            itemPackage,
            fieldsType,
            setLoading,
            schemaActions,
            setNotifications,
          );
          setIsAdded(true);
        }}
        disabled={!user || loading}
        className="mt-2 px-2 py-1 text-body rounded-lg bg-accent items-center justify-center flex flex-row"
      >
        {isAdded ? (
          <View className="flex-row gap-2">
            <Ionicons name="checkmark-done" size={24} className="!text-body" />
            <Text
              key={`${item?.[fieldsType.idField]}-${fieldsType.cardAction}-${itemPackage?.[fieldsType.cardAction] ?? 0}`}
              className="text-white text-lg"
            >
              {itemPackage?.[fieldsType.cardAction] ?? 0}
            </Text>
          </View>
        ) : !loading ? (
          <Feather name="plus" size={24} className="!text-body" />
        ) : (
          <View className="flex-row items-center justify-center mx-auto">
            <ActivityIndicator
              size="small"
              className="text-body flex-row justify-center"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
  return (
    <DisplayButton fieldsType={fieldsType} itemPackage={itemPackage}>
      <View>
        {(itemPackage?.[fieldsType.cardAction] ?? 0 > 0) ? (
          <View className="flex flex-row bg-accent justify-between items-center rounded-md mt-2 p-2">
            {!loading ? (
              <>
                <Pressable
                  onPress={async () => {
                    await UpdateCart(
                      1,
                      itemPackage,
                      fieldsType,
                      setLoading,
                      schemaActions,
                      setNotifications,
                    );
                  }}
                  disabled={loading}
                >
                  <Feather name="plus" size={24} className="!text-body mx-2" />
                </Pressable>

                <Text
                  key={`${item?.[fieldsType.idField]}-${fieldsType.cardAction}-${itemPackage?.[fieldsType.cardAction] ?? 0}`}
                  className="text-white text-lg"
                >
                  {itemPackage?.[fieldsType.cardAction] ?? 0}
                </Text>

                <Pressable
                  onPress={async () => {
                    await UpdateCart(
                      -1,
                      itemPackage,
                      fieldsType,
                      setLoading,
                      schemaActions,
                      setNotifications,
                    );
                  }}
                  disabled={
                    loading || (itemPackage?.[fieldsType.cardAction] ?? 0) === 0
                  }
                >
                  <Feather name="minus" size={24} className="!text-body mx-2" />
                </Pressable>
              </>
            ) : (
              <View className="flex-row items-center justify-center mx-auto">
                <ActivityIndicator
                  size="small"
                  className="text-body flex-row justify-center"
                />
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              await UpdateCart(
                1,
                itemPackage,
                fieldsType,
                setLoading,
                schemaActions,
                setNotifications,
              );
            }}
            disabled={!user || loading}
            className="mt-2 p-2 rounded-lg bg-accent items-center justify-center flex flex-row"
          >
            {!loading ? (
              <>
                <Text className="text-body text-lg font-bold hidden md:flex">
                  {localization.Hum_screens.menu.addToCartButton}
                </Text>
                <Feather
                  name="shopping-cart"
                  size={22}
                  className="!text-body px-1"
                />
              </>
            ) : (
              <View className="flex-row items-center justify-center mx-auto">
                <ActivityIndicator
                  size="small"
                  className="text-body flex-row justify-center"
                />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </DisplayButton>
  );
};
const DisplayButton = ({ itemPackage, fieldsType, children }) => {
  if (!itemPackage[fieldsType.isAvailable]) {
    return (
      <View className="flex-row justify-center w-full items-center">
        <View
          className="w-10 items-center mt-2 px-2 py-1 rounded-lg !border-accent"
          style={{ borderWidth: 2, borderColor: theme.accent }}
        >
          <Text
            key={`${itemPackage?.[fieldsType.idField]}-${fieldsType.cardAction}-${itemPackage?.[fieldsType.cardAction] ?? 0}`}
            className="mx-4 text-lg text-body"
          >
            {itemPackage?.[fieldsType.cardAction] ?? 0}
          </Text>
        </View>
      </View>
    );
  }
  return <>{children}</>;
};
//<Text className="text-body text-lg font-bold">Add to Cart</Text>

export { AddToCartPrimaryButton, AddToCartSecondaryButton };
