import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import AddAssetsSchema from "../../Schemas/MenuSchema/AddAssetsSchema.json";
import PopupModal from "../../utils/component/PopupModal";

export default function AddAsset({}) {
  // const { addressLocationState } = useSchemas();

  // const idField = addressLocationState.schema.idField;
  // const displayLookupParam =
  //   addressLocationState.schema.dashboardFormSchemaParameters.find(
  //     (pram) => pram.parameterType == "displayLookup",
  //   );
  // const tag = getField(
  //   addressLocationState.schema.dashboardFormSchemaParameters,
  //   "addressLocationTag",
  // );
  // const [location, setLocation] = useState(null);
  const [reqError, setReqError] = useState(null);
  const [disable, setDisable] = useState(false);
  // const { selectedLocation, setSelectedLocation } = useShopNode();
  // const localization = useSelector((state) => state.localization.localization);
  // const locations = useSelector((state) => state.location.locations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // const postAction =
  //   addressLocationState.actions &&
  //   addressLocationState.actions.find(
  //     (action) => action.dashboardFormActionMethodType === "Post",
  //   );
  const onSubmit = async (data: any) => {
    console.log('====================================');
    console.log(data,'data');
    console.log('====================================');
    // await handleSubmitWithCallback({
    //   data,
    //   setDisable,
    //   action: postAction,
    //   proxyRoute: addressLocationState.schema.projectProxyRoute,
    //   setReq: setReqError,
    //   onSuccess: (resultData) => {
    //     AddAddressLocation(resultData);
    //     setIsModalVisible(false);

    //     dispatch(updateSelectedLocation(resultData));
    //     setSelectedLocation(resultData);
    //   },
    // });
  };
  // useEffect(() => {
  //   if (!loading && rows.length > 0) {
  //     //!send here the req
  //     const selectedRow = rows.find(
  //       (row) => row[idField] === selectedLocation[idField],
  //     );

  //     if (!selectedRow) {
  //       dispatch(updateSelectedLocation(rows[0]));
  //       setSelectedLocation(rows[0]);
  //     }
  //   }
  // }, [loading]);
console.log('====================================');
console.log(AddAssetsSchema,'AddAssetsSchema');
console.log('====================================');
  return (
    <View>
      <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          // Platform.OS !== "web" && reset();
        }}
        // onSubmit={async () => {
        //   handleSubmit(onSubmit);
        // }}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        headerTitle={
          'addAsset'
        }
        row={{}}
        schema={AddAssetsSchema}
        errors={reqError || errors}
        disable={disable}
      />
      <View className="flex flex-row items-center">
        <TouchableOpacity
          className="p-2 w-full rounded-lg bg-accent items-center justify-center me-2"
          onPress={() => setIsModalVisible(true)}
        >
          <Entypo name="plus" size={20} className="!text-body" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
