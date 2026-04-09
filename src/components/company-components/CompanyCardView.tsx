import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Card } from "../../../components/ui";
import { theme } from "../../Theme";
import PricePlansSection from "../cards/PricePlansSection";
import CompanyCard from "../cards/CompanyCard";
import { useNavigation } from "@react-navigation/native";
import PropertyCardButtonsActions from "../cards/PropertyCardButtonsActions";
import { getUniqueKey } from "../../utils/operation/getUniqueKey";
import AssetDetailsAction from "./AssetDetailsAction";

//todo update att when any param changes
//todo then take att and make utility that helps to get the correct item form items by attribute so the utility with make sure that the two objs is the same
//todo then update the item my item that get from the attributes
const CompanyCardView = ({
  itemPackage,
  selectedItems,
  setSelectedItems,
  schemaActions,
}: {
  itemPackage: any;
  selectedItems?: any[];
  setSelectedItems?: (items: any[]) => void;
  schemaActions: any;
}) => {
  //!uncomment the attribute
  // const [att, setAtt] = useState(item.attribute);
  const navigation = useNavigation();
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const selected = false;
  // const selected = selectedItems.find(
  //   (selected) => selected[fieldsType.idField] === item[fieldsType.idField]
  // );
  // Form control
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    // defaultValues: att, // Set initial form values
  });

  // Watch form values and update att when they change
  // useEffect(() => {
  //   const subscription = watch((values) => {
  //     setAtt(values);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);
  // useEffect(() => {
  //   const findMatchingItem = (items, att) => {
  //     return items.find((item) => areObjectsEqual(item.attribute, att));
  //   };
  //   if (itemPackage.items) {
  //     setItem(findMatchingItem(itemPackage.items, att));
  //   }
  // }, [att]);
  // useEffect(() => {
  //   setItem(itemPackage);
  //   setAtt(itemPackage.attribute);
  // }, [itemPackage]);

  return (
    <AssetDetailsAction
      key={getUniqueKey(
        itemPackage[fieldsType.idField],
        fieldsType.attributes,
        JSON.stringify(itemPackage),
      )}
      itemPackage={itemPackage}
    >
      <CompanyCard itemPackage={itemPackage} schemaActions={schemaActions} />
    </AssetDetailsAction>
  );
};

export default CompanyCardView;
