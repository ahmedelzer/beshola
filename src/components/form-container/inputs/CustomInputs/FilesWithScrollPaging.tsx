import React, { useEffect, useReducer, useState, useCallback } from "react";
import { View, FlatList } from "react-native";
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

function FilesWithScrollPaging({
  title,
  idField,
  row,
  selectedServerFiles,
  setSelectedServerFiles,
  getAction,
  fileFieldName,
  proxyRoute,
}) {
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...row,
    });
  };
  const { rows, totalCount, loading, handleScroll } = usePreloadList({
    idField: idField,
    getAction: getAction,
    dataSourceAPI: dataSourceAPI,
    cacheTime: 4,
    deps: [],
  });

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
        : [...prev, { ...file, ...row }],
    );
  };

  const renderItem = ({ item }) => {
    const buildFileUrl = (base, path) => {
      if (!path) return "";

      return `${base.replace(/\/+$/, "")}/${path
        .replace(/\\/g, "/") // ✅ FIX BACKSLASH
        .replace(/^\/+/, "")}`; // ✅ remove leading slash
    };
    const photo = {
      ...item,
      displayFile: item[fileFieldName],
      file: buildFileUrl(publicImageURL, item[fileFieldName]),
      type: item.fileCodeNumber === 0 ? "image" : "video",
      id: item[idField],
    };

    return (
      <View className="mb-3 p-2 bg-body rounded-xl shadow">
        <View className="mb-3 p-3 bg-body rounded-2xl shadow">
          {/* Checkbox */}
          <View className="mb-2">
            <Checkbox
              value={selectedServerFiles.some((f) => f.id === photo.id)}
              onChange={() => handleCheckboxChange(photo)}
            >
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
            </Checkbox>
          </View>

          {/* File Preview */}
          <TypeFile file={photo.file} title={title} type={photo.type} />
        </View>

        {/* File */}
        {/* <TypeFile file={photo.file} title={title} type={photo.type} /> */}
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        onEndReached={handleScroll}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View className="items-center my-4">
              <Circle size={30} color="#3b82f6" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

export default FilesWithScrollPaging;
