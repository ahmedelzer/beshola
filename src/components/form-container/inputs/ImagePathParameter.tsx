import React, { Component } from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";

import defaultImage from "../../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";

import BaseInput from "./BaseInput";
import ImageParameter from "./ImageParameter";
import BrowserUrlAction from "./InputActions/BrowserUrlAction";
import UploadAction from "./InputActions/UploadAction";

import { publicImageURL } from "./../../../../request";
import convertImageToBase64 from "./InputActions/ConvertImageToBase64";
import ServerUploadAction from "./InputActions/ServerUploadAction";

class ImageParameterWithPanelActions extends BaseInput {
  constructor(props) {
    super(props);

    this.state = {
      FileData:
        props.type === "publicImage" && props.value
          ? publicImageURL + props.value
          : props.value,
    };
  }

  render() {
    const { FileData } = this.state;
    const { isFileContainer = false, control, fieldName, type } = this.props;

    return (
      <View>
        <Controller
          control={control}
          name={fieldName}
          defaultValue=""
          render={({ field: { onChange, value } }) => {
            const handleImageUpload = async (path, type) => {
              try {
                const base64 = await convertImageToBase64(path);

                // set value inside react-hook-form
                onChange(base64);

                // update preview
                this.setState({
                  FileData: path || defaultImage,
                });
              } catch (error) {
                console.error("Base64 conversion failed", error);
              }
            };

            const actions = [
              <ServerUploadAction
                key="upload"
                fieldName={fieldName}
                isFileContainer={isFileContainer}
                onImageUpload={handleImageUpload}
                {...this.props}
              />,
            ];

            return (
              <ImageParameter
                {...this.props}
                value={FileData}
                formValue={value} // base64 stored in form
                actions={actions}
              />
            );
          }}
        />
      </View>
    );
  }
}

export default ImageParameterWithPanelActions;
