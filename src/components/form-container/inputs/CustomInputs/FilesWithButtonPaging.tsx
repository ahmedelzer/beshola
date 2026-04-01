import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../../../components/hooks/APIsFunctions/BuildApiUrl";
import { getRemoteRows } from "../../../Pagination/getRemoteRows";
import { usePreloadList } from "../../../Pagination/usePreloadList";
import DeleteItem from "../../../../utils/operation/DeleteItem";
import { View } from "react-native";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TypeFile from "./TypeFile";
import { Button } from "../../../../../components/ui";
import { Text } from "react-native";
import { publicImageURL } from "../../../../../request";
import { buildFileUrl } from "../../../../utils/operation/buildFileUrl";
function FilesWithButtonPaging({
  title,
  idField,
  row,
  getAction,
  deleteAction,
  handleToDelete,
  fileFieldName,
}) {
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteWithApi, setDeleteWithApi] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { control, handleSubmit, formState, watch } = useForm();
  const { errors } = formState;
  const localization = useSelector((state) => state.localization.localization);
  const [files, setFiles] = useState([]);

  const { [fileFieldName]: _, ...rowWithoutFieldName } = row;
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: currentPage,
      pageSize: take,
      ...row,
    });
  };
  const { rows, totalCount, loading, state, handleScroll, dispatch } =
    usePreloadList({
      idField: idField,
      getAction: getAction,
      dataSourceAPI: dataSourceAPI,
      cacheTime: 4,
      deps: [currentPage],
    });

  // 🔥 Infinite Scroll
  const handleLoadMore = () => {
    if (!loading && rows.length < totalCount) {
    }
  };

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setItemsPerPage(8);
    } else if (width >= 768) {
      setItemsPerPage(6);
    } else if (width >= 640) {
      setItemsPerPage(4);
    } else {
      setItemsPerPage(2);
    }
  };

  // Set itemsPerPage on component mount and window resize
  useEffect(() => {
    updateItemsPerPage(); // Set initial value
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Load data whenever skip or take state changes
  const totalPages = Math.ceil(state.totalCount / itemsPerPage);

  const handlePageChange = (newPage) => {
    getRemoteRows(newPage, itemsPerPage, dispatch);
    setCurrentPage(newPage);
  };

  const handleDelete = (index, withApi) => {
    setDeleteID(index);
    setDeleteWithApi(withApi);
    setModalDeleteIsOpen(true);
  };
  const updateRowsAfterDelete = (deletedId) => {
    // Remove from cache

    const updatedRows = state.rows.filter((r) => r[idField] !== deletedId);

    let newTotalCount = state.totalCount - 1;

    // If page becomes empty, go back one page
    if (updatedRows.length === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
      return;
    }

    dispatch({
      type: "UPDATE_ROWS",
      payload: {
        rows: updatedRows,
        totalCount: newTotalCount,
        skip: state.skip,
      },
    });
  };
  const data =
    state.rows?.map((row) => ({
      ...row,
      displayFile: buildFileUrl(publicImageURL, row[fileFieldName]),
      fileCodeNumber: row.fileCodeNumber === 0 ? "image" : "video",
      id: row[idField],
    })) || [];

  return (
    <View className="flex-1">
      {/* 🔲 GRID */}
      <FlatList
        data={data}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View className="flex-1 m-1 bg-white rounded-xl p-2 shadow">
            {/* 🗑 DELETE BUTTON */}
            {deleteAction && (
              <View className="flex-row justify-end">
                <TouchableOpacity onPress={() => handleDelete(item.id, true)}>
                  <MaterialIcons name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View>
            )}

            {/* 📁 FILE PREVIEW */}
            <TypeFile
              file={item.displayFile}
              title={title}
              type={item.fileCodeNumber}
            />
          </View>
        )}
      />

      {/* 📄 PAGINATION */}
      <View className="flex-row items-center justify-center mt-4 space-x-4">
        <Button
          onPress={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          <Text>{localization.fileContainer.pagination.buttonPrevious}</Text>
        </Button>

        <Text className="mx-4">
          {localization.fileContainer.pagination.page} {currentPage}{" "}
          {localization.fileContainer.pagination.of} {totalPages}
        </Text>

        <Button
          onPress={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        >
          <Text>{localization.fileContainer.pagination.buttonNext}</Text>
        </Button>
      </View>

      {/* 🗑 DELETE MODAL */}
      {/* <DeleteItem
        id={deleteID}
        modalIsOpen={modalDeleteIsOpen}
        setModalIsOpen={setModalDeleteIsOpen}
        DeleteItemCallback={() => {
          handleToDelete();
          updateRowsAfterDelete(deleteID);
          setModalDeleteIsOpen(false);
        }}
        deleteWithApi={deleteWithApi}
        action={deleteAction}
      /> */}
    </View>
  );
}

export default FilesWithButtonPaging;
