import React, { useState } from "react";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { Card, Box } from "../../../components/ui";
import { theme } from "../../Theme";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import { addAlpha } from "../../utils/operation/addAlpha";
import ImageCardActions from "./ImageCardActions";
import AddressComponent from "./AddressComponent";
import PopupModal from "../../utils/component/PopupModal";

// ✅ Schemas
import AddAssetFilesSchema from "../../Schemas/MenuSchema/AddAssetFilesSchema.json";
import AddAssetsSchema from "../../Schemas/MenuSchema/AddAssetsSchema.json";
import AddAssetFilesSchemaActions from "../../Schemas/MenuSchema/AddAssetFilesSchemaActions.json";
import PricePlanSchemaActions from "../../Schemas/MenuSchema/PricePlanSchemaActions.json";
import PricePlansSchema from "../../Schemas/MenuSchema/PricePlanSchema.json";
import { handleSubmitWithCallback } from "../../utils/operation/handleSubmitWithCallback";
import FormContainer from "../form-container/FormContainer";
import { GetFieldsItemTypes } from "../../utils/operation/GetFieldsItemTypes";
import { getField } from "../../utils/operation/getField";
import { ButtonInput } from "../form-container";
import { CreateInputProps } from "../form-container/CreateInputProps";

const OwnAssetCard = ({
  itemPackage,
  selectedItems = [],
  setSelectedItems,
  schemaActions,
}) => {
  const [item] = useState(itemPackage);

  const parameters = AddAssetsSchema?.dashboardFormSchemaParameters ?? [];

  const fieldsType = {
    imageView: getField(parameters, "hiddenDisplayFile"),
    address: getField(parameters, "hiddenAddress"),
    streetName: getField(parameters, "streetName"),
    idField: AddAssetsSchema.idField,
    dataSourceName: AddAssetsSchema.dataSourceName,
    zoneName: getField(parameters, "zoneName"),
    buildNumber: getField(parameters, "buildNumber"),
    floorNumber: getField(parameters, "floorNumber"),
    partitionNumber: getField(parameters, "partitionNumber"),
    flagMark: getField(parameters, "flagMark"),
    latitude: getField(parameters, "locationLatitudePoint"),
    longitude: getField(parameters, "locationLongitudePoint"),
    isActive: getField(parameters, "isActive"),
  };
  const ownSchemaWithButtonOnlyParameters = {
    ...AddAssetsSchema,
    dashboardFormSchemaParameters:
      AddAssetsSchema.dashboardFormSchemaParameters.filter(
        (pram) => pram.parameterType === "detailsCell",
      ),
  };
  // ✅ Modal State (CLEAN)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "files" | "price"
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);

  // ✅ Form
  const { control, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const imageSize = getResponsiveImageSize(0.2, { min: 30, max: 80 });

  // ✅ Dynamic Schema
  const getSchema = () => {
    if (modalType === "files") return AddAssetFilesSchema;
    if (modalType === "price") return PricePlansSchema;
    return null;
  };

  // ✅ Dynamic Title
  const getTitle = () => {
    if (modalType === "files") return "Add Files";
    if (modalType === "price") return "Add Price Plans";
    return "";
  };

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    const postAction = () => {
      if (modalType === "files") {
        return (
          AddAssetFilesSchemaActions &&
          AddAssetFilesSchemaActions.find(
            (action) => action.dashboardFormActionMethodType === "Post",
          )
        );
      } else if (modalType === "price") {
        return (
          PricePlanSchemaActions &&
          PricePlanSchemaActions.find(
            (action) => action.dashboardFormActionMethodType === "Post",
          )
        );
      }
    };
    try {
      await handleSubmitWithCallback({
        data,
        setDisable,
        action: postAction(),
        proxyRoute: postAction().projectProxyRoute,
        setReq: setReqError,
        onSuccess: (resultData) => {
          // AddAddressLocation(resultData);
          // setIsModalVisible(false);
          // dispatch(updateSelectedLocation(resultData));
          // setSelectedLocation(resultData);
        },
      });

      if (modalType === "files") {
        console.log("FILES DATA:", data);
        // 🔥 TODO: API call (add files)
      }

      if (modalType === "price") {
        console.log("PRICE PLANS DATA:", data);
        // 🔥 TODO: API call (add price plans)
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      setModalType(null);
    }
  };

  return (
    <View className="mb-3">
      {/* ✅ Modal */}
      {/* <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setModalType(null);
        }}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        headerTitle={getTitle()}
        row={{}}
        schema={getSchema()}
        errors={errors}
        disable={loading}
      /> */}

      {/* ✅ Card */}
      <Card
        className="items-center overflow-hidden border !rounded-none"
        style={{
          backgroundColor: addAlpha(theme.body, 0.15),
          borderColor: addAlpha(theme.body, 0.5),
        }}
      >
        <View className="flex-row items-center mt-2 px-2 w-full">
          {/* Image */}
          <View
            className="flex flex-col relative"
            style={{ width: "66.666667%" }}
          >
            <MemoizedImageCard
              item={item}
              fieldsType={fieldsType}
              imageSize={imageSize}
              schemaActions={schemaActions}
            />
            {/* Address */}
            <View className="w-full justify-center items-center">
              {fieldsType.address && item[fieldsType.address] && (
                <AddressComponent
                  addressText={item[fieldsType.address]}
                  fieldsType={fieldsType}
                  item={item}
                />
              )}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-col justify-center items-center w-1/3">
            {ownSchemaWithButtonOnlyParameters.dashboardFormSchemaParameters
              .filter(
                (column: any) =>
                  !column.isIDField &&
                  column.isEnable &&
                  !column.parameterType.startsWith("hidden"),
              )
              .map((param: any) => {
                return (
                  <ButtonInput
                    parentSchema={ownSchemaWithButtonOnlyParameters}
                    {...CreateInputProps(param, {})}
                  />
                );
              })}
            {/* Contact Icon */}
            {/* <TouchableOpacity
              className="p-2 rounded-full mb-2"
              style={{ backgroundColor: theme.accent }}
              onPress={() => console.log("Contact pressed")}
            >
              <AntDesign name="form" size={20} color={theme.body} />
            </TouchableOpacity> */}

            {/* ✅ Add Files */}
            {/* <TouchableOpacity
              onPress={() => {
                setModalType("files");
                setIsModalVisible(true);
              }}
              className="p-2 rounded-full mb-2"
              style={{ backgroundColor: theme.accent }}
            >
              <Feather name="paperclip" size={20} color="white" />
            </TouchableOpacity> */}

            {/* ✅ Add Price Plans */}
            {/* <TouchableOpacity
              onPress={() => {
                setModalType("price");
                setIsModalVisible(true);
              }}
              className="p-2 rounded-full"
              style={{ backgroundColor: theme.accent }}
            >
              <MaterialCommunityIcons
                name="cash-plus"
                size={20}
                color="white"
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default OwnAssetCard;

/////////////////////////////////////////////////////////

export const MemoizedImageCard = React.memo(
  ({ item, fieldsType, imageSize, schemaActions }) => {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === "web";

    return (
      <Box className="w-full flex justify-center items-center overflow-hidden">
        <ImageCardActions
          fieldsType={fieldsType}
          item={item}
          showFaovertIcon={fieldsType.isFav}
          style={{ width: imageSize, height: imageSize }}
          className={isWeb ? "!w-[30%] !h-20 sm:!h-32 lg:!h-46" : "!size-20"}
        >
          <></>
        </ImageCardActions>
      </Box>
    );
  },
  (prev, next) =>
    prev.item === next.item &&
    prev.fieldsType === next.fieldsType &&
    prev.imageSize === next.imageSize,
);
