import React from "react";
import InputDisplay from "./InputDisplay";
import { GetInputComponent } from "./GetInputComponent";
import { CreateInputProps } from "./CreateInputProps";

export default function DataCellRender({
  data,
  errorResult,
  onChange,
  value,
  control,
  row,
  ...props
}) {
  // Determine the key to use for input mapping
  const inputKey = data.parameterType;
  const InputComponentClass = GetInputComponent(inputKey);
  // Optionally instantiate the class (if needed)
  const displayLabel = () => {
    if (
      data.parameterType === "button" ||
      data.parameterType === "detailsCell" ||
      data.parameterType === "calculateTimes" ||
      data.parameterType === "nodeLongitudePoint"
    )
      return false;
    return true;
  };
  
  return (
    <InputDisplay
      props={{
        ...CreateInputProps(data, value),
        onChange: onChange,
        control: control,
        showTitle: props.showTitle || displayLabel(),
        ...props,row
      }}
      errorResult={errorResult}
      BaseInput={InputComponentClass}
    />
  );
}
