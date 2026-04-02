import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import GoBackHeader from "../header/GoBackHeader";
import FormContainer from "../form-container/FormContainer";
import { FormProvider, useForm } from "react-hook-form";
import schema from "../../Schemas/MenuSchema/FilterSchema.json";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../reducers/FilterReducer";
import { tabsData } from "../company-components/tabsData";
import { buildFilterRow } from "../../utils/operation/buildFilterRow";
import { SearchProvider, useSearch } from "../../../context/SearchProvider";
import DynamicRangeSchema from "../../utils/component/DynamicRangeComponent";
import { theme } from "../../Theme";

export default function MenuFilter({
  onFilterDone = (filters) => {},
  filtersMap,
}) {
  const [updateKey, setUpdateKey] = useState(1);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    ...methods
  } = useForm();
  const localization = useSelector((state) => state.localization.localization);

  const filterRow = useSelector((state) => state.filter.filterRow); // Read filterRow from Redux
  const dispatch = useDispatch();
  // Filtering Logic
  const filterData = (filters) => {
    const { checkbox, gender, howMany, price = {}, rating = {} } = filters;

    return tabsData.filter((item) => {
      // Checkbox filtering
      if (checkbox !== undefined && item.checkbox !== checkbox) {
        return false;
      }

      // Gender filtering
      if (gender && item.gender !== gender) {
        return false;
      }

      // How many filtering
      if (howMany && item.howMany !== howMany) {
        return false;
      }

      // Price range filtering
      if (
        (price.min !== undefined && item.price < price.min) ||
        (price.max !== undefined && item.price > price.max)
      ) {
        return false;
      }

      // Rating range filtering
      if (
        (rating.min !== undefined && item.rating < rating.min) ||
        (rating.max !== undefined && item.rating > rating.max)
      ) {
        return false;
      }

      return true;
    });
  };
  // Handle form submission
  const onSubmit = (data) => {
    console.log("====================================");
    console.log(data, "data");
    console.log("====================================");
    const formattedFilters = buildFilterRow(data);

    onFilterDone({ ...filterRow, ...formattedFilters });
    dispatch(updateFilters({ ...filterRow, ...formattedFilters })); // Update Redux state with submitted data
  };
  // Update filtered data when filters change
  useEffect(() => {}, [filterRow]);
  // Clear all filters
  const handleClearAll = () => {
    dispatch(updateFilters({})); // Reset filters in Redux state
    reset({}); // Reset form values to initial state
    setUpdateKey((prevTrigger) => prevTrigger + 1);
  };

  // Watch for updates to filterRow
  useEffect(() => {}, [filterRow]);

  return (
    <View className="flex-1 bg-body">
      {/* Header */}
      {/* <GoBackHeader
        title={localization.Hum_screens.menu.filter.header.title}
        subTitle={localization.Hum_screens.menu.filter.header.title.subTitle}
      /> */}

      {/* Clear All Button */}
      <TouchableOpacity
        className="flex flex-row items-end justify-end my-1"
        onPress={handleClearAll}
      >
        <Text className="text-md font-bold text-accent">
          {localization.Hum_screens.menu.filter.clearButton}
        </Text>
      </TouchableOpacity>
      {/* Form Content */}
      <ScrollView>
        {/* <FormProvider {...methods}> */}
        <FormContainer
          key={updateKey}
          tableSchema={schema}
          row={{
            rating: { min: 1, max: 400 },
            bedrooms: { min: 1, max: 20 },
            bathrooms: { min: 1, max: 10 },
            area: { min: 80, max: 1000 },
          }} // Populate form with Redux state
          errorResult={errors}
          control={control}
          setValue={setValue}
          filtersMap={filtersMap}
          labelStyle={{
            fontSize: 16,
            color: theme.body, // text color for contrast
            backgroundColor: theme.accent,
            fontWeight: "bold",
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        />
        {/* </FormProvider> */}
      </ScrollView>

      {/* Footer Button */}
      <View className="p-2 bg-body border-t border-card">
        <TouchableOpacity
          className="bg-accent py-3 rounded-lg"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-body text-center text-lg font-semibold">
            {localization.Hum_screens.menu.filter.applyButton}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    // <></>
  );
}
