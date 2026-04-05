import React, { useEffect, useReducer, useState, useCallback } from "react";
import { View, FlatList, Pressable } from "react-native";
import { Circle } from "react-native-animated-spinkit";

import { publicImageURL } from "../../../../../request";

import TypeFile from "./TypeFile";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckIcon,
} from "../../../../../components/ui";
import { buildApiUrl } from "../../../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../../../components/hooks/APIsFunctions/LoadData";
import { usePreloadList } from "../../../Pagination/usePreloadList";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
import ImageParameterWithPanelActions from "../ImagePathParameter";
import { useForm } from "react-hook-form";
import convertImageToBase64 from "../InputActions/ConvertImageToBase64";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { cleanObject } from "../../../../utils/operation/cleanObject";
import { getFileTypeFromUrl } from "../../../../utils/operation/getFileTypeFromUrl";
import { ScrollView } from "react-native-gesture-handler";
import { buildFileUrl } from "../../../../utils/operation/buildFileUrl";

function FilesWithScrollPaging({
  title,
  idField,
  row,
  selectedServerFiles,
  setSelectedServerFiles,
  getAction,
  fileFieldName,
  handleUpload,
  setSelectedFiles,
  fileStatuesFieldName,
}) {
  const { control, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const localization = useSelector((state) => state.localization.localization);
  const [files, setFiles] = useState([]);

  const { [fileFieldName]: _, ...rowWithoutFieldName } = row;
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...row,
    });
  };
  const { rows, totalCount, loading, lastQuery, handleScroll } = usePreloadList(
    {
      idField: idField,
      getAction: getAction,
      dataSourceAPI: dataSourceAPI,
      cacheTime: 4,
      deps: [],
    },
  );

  // 🔥 Infinite Scroll
  const handleLoadMore = () => {
    if (!loading && rows.length < totalCount) {
    }
  };

  // 🔥 Select file
  const handleCheckboxChange = (file) => {
    setSelectedServerFiles((prev) =>
      prev.some((f) => f.id === file.id)
        ? prev.filter((f) => f.id !== file.id)
        : [...prev, { ...row, ...file }],
    );
  };
  const renderItem = ({ item }) => {
    const photo = {
      ...item,
      displayFile: item[fileFieldName].split("?v")[0],
      file: buildFileUrl(publicImageURL, item[fileFieldName]),
      type: getFileTypeFromUrl(
        buildFileUrl(publicImageURL, item[fileFieldName]),
      ),
      id: item[idField],
      status :item?.[fileStatuesFieldName]
    };

    const isSelected = selectedServerFiles.some((f) => f.id === photo.id);
    
    return (
      <View className="me-4">
        {/* Card */}
        <View className="w-40 bg-body rounded-2xl shadow overflow-hidden">
          {/* Image */}
          <View
            className={
              "h-40 w-full !border-3" 
              
            }
          >
            <TypeFile file={photo.file} title={title} type={photo.type} 
            haveFileStatuesFieldName={photo.status?true:false} 
            fileStatuesFieldNameValue={photo.status} />
          </View>

          {/* Checkbox Overlay */}
          <View className="absolute top-2 right-2 bg-body rounded-full p-1 shadow">
            <Checkbox
              value={isSelected}
              onChange={() => handleCheckboxChange(photo)}
            >
              <CheckboxIndicator>
                <CheckboxIcon
                  as={
                    Platform.OS == "web"
                      ? () => (
                          <MaterialIcons name="check" size={20} color="white" />
                        )
                      : CheckIcon
                  }
                />
              </CheckboxIndicator>
            </Checkbox>
          </View>
        </View>
      </View>
    );
  };
  useEffect(() => {
    const subscription = watch((formValues) => {
      // Clean object is optional if you want to remove empty/undefined values
      const cleanedValues = cleanObject(formValues);
      setSelectedFiles([
        {
          ...rowWithoutFieldName,
          ...cleanedValues,
        },
      ]);
    });

    return () => subscription.unsubscribe();
  }, [watch]);
  const handleAddMore = () => {
    handleUpload();
    setFiles([]);
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-1 flex-row items-center"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <View>
        <ImageParameterWithPanelActions
          fieldName={fileFieldName || "image"}
          isFileContainer={true}
          control={control}
          enable={true}
          allowDrop={false}
          title={title}
          onChange={() => {}}
        />
        {control._formValues?.[fileFieldName] !== "" && (
          <Pressable
            onPress={handleAddMore}
            className="px-4 py-2 bg-accentHover rounded-lg"
          >
            <Text className="text-body">
              {localization.webcam.modal.button.capture}
            </Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
        onEndReached={handleScroll}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View className="justify-center items-center px-4">
              <Circle size={30} color="#3b82f6" />
            </View>
          ) : null
        }
      />
    </ScrollView>
  );
}

export default FilesWithScrollPaging;
