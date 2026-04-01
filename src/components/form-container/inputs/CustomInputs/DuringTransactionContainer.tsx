import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Circle } from "react-native-animated-spinkit";
import { useSelector } from "react-redux";
import { onApply } from "../../OnApply";
import FormContainer from "../../FormContainer";
import { Button, ButtonText } from "../../../../../components/ui";
import { useForm } from "react-hook-form";

function DuringTransactionContainer({
  tableSchema,
  TransformDone,
  automated,
  selectionContext,
  open,
  setOpen,
  action,
  setSelectionContext,
  proxyRoute,
}) {
  const localization = useSelector((state) => state.localization.localization);

  const iDField = tableSchema.idField;

  const [result, setResult] = useState(false);
  const [automatic, setAutomatic] = useState(automated);
  const [initialRow, setInitialRow] = useState({});
  const [textButton, setTextButton] = useState("");
  const [index, setIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [openLoadingModel, setOpenLoadingModel] = useState(automated);

  let editedRow = { ...initialRow };
  const { control, formState, watch } = useForm();
  const { errors } = formState;
  // Init
  useEffect(() => {
    if (selectionContext.length > 0) {
      setInitialRow(selectionContext[0]);
      setIndex(0);
      setTotalFiles(selectionContext.length);
      setUploadedFiles(0);
      setOpenLoadingModel(automated);
    }
  }, [selectionContext]);

  // Button text
  useEffect(() => {
    if (index < selectionContext.length - 1) {
      setTextButton(localization.tableTransform.textButtonNextValue);
    } else {
      setTextButton(localization.tableTransform.textButtonFinishValue);
    }
  }, [index, selectionContext]);

  function MoveOn() {
    const newIndex = index + 1;

    setIndex(newIndex);

    if (newIndex < selectionContext.length) {
      setInitialRow(selectionContext[newIndex]);
    } else {
      setOpen(false);
    }

    setUploadedFiles((prev) => prev + 1);
  }

  function Skip() {
    MoveOn();
  }

  // 🔥 IMPORTANT: RN submit handler (no form)
  const handleSubmit = async () => {
    const apply = await onApply(editedRow, iDField, true, action, proxyRoute);

    setResult(apply);

    if (apply && apply.success === true) {
      MoveOn();
      TransformDone();
    }
  };

  // 🔥 Automated mode
  const AutomatedTransform = async () => {
    if (selectionContext.length > 0) {
      setSelectionContext([]);
      const tasks = selectionContext.map((item) =>
        onApply(
          item,
          iDField,
          true,
          action,
          proxyRoute,
          tableSchema.dashboardFormSchemaParameters,
        ).then(() => MoveOn()),
      );

      await Promise.all(tasks);

      TransformDone();

      setAutomatic(false);
      setTotalFiles(selectionContext.length);
      setUploadedFiles(selectionContext.length);

      setTimeout(() => {
        setOpenLoadingModel(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (automated) {
      AutomatedTransform();
    }
  }, [automated, selectionContext, proxyRoute]);

  const ReturnRow = (updatedRow) => {
    editedRow = { ...updatedRow(), ...initialRow };
  };
  return (
    <View className="flex-1">
      {/* FORM UI */}
      {open && (
        <View className="p-4 bg-white rounded-2xl shadow">
          <FormContainer
            control={control}
            tableSchema={tableSchema}
            row={editedRow}
            returnRow={ReturnRow}
            errorResult={result}
          />

          {/* Buttons */}
          <View className="flex-row justify-between mt-4">
            <Button variant="outline" onPress={Skip} className="flex-1 mr-2">
              <MaterialIcons name="skip-next" size={18} color="black" />
              <ButtonText>
                {localization.tableTransform.textButtonSkipValue}
              </ButtonText>
            </Button>

            <Button onPress={handleSubmit} className="flex-1 ml-2">
              <ButtonText>{textButton}</ButtonText>
            </Button>
          </View>
        </View>
      )}

      {/* 🔥 Loading Spinner */}
      {openLoadingModel && (
        <View className="items-center justify-center mt-4">
          <Circle size={40} color="#3b82f6" />
        </View>
      )}

      {/* Progress
      <ProgressFilesLoading
        modalOpen={openLoadingModel}
        totalFiles={totalFiles}
        uploadedFiles={uploadedFiles}
      /> */}
    </View>
  );
}

export default DuringTransactionContainer;
