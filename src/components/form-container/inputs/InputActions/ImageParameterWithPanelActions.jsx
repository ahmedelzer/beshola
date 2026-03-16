// import React, { Component } from "react";
// import { View } from "react-native";

// import defaultImage from "../../../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
// import BaseInput from "../BaseInput";
// import ImageParameter from "../ImageParameter";
// import BrowserUrlAction from "./BrowserUrlAction";
// import UploadAction from "./UploadAction";

// import { publicImageURL } from "../../../../../request";
// import convertImageToBase64 from "./ConvertImageToBase64";
// import { Controller } from "react-hook-form";
//   const addFileActions = async (path, type) => {
//     try {
//       const base64String = await convertImageToBase64(path);
//       setFiles((prevFiles) => [
//         ...prevFiles,
//         {
//           file: path,
//           id: prevFiles.length,
//           [fieldName]: base64String,
//           type: type,
//           ...rowWithoutFieldName,
//         },
//       ]);
//       return base64String;
//     } catch (error) {
//       console.error("Failed to convert image to Base64:", error);
//       return null;
//     }
//   };
// class ImageParameterWithPanelActions extends BaseInput {
//   constructor(props) {
//     super(props);

//     this.state = {
//       FileData:
//         props.type === "publicImage" && props.value
//           ? publicImageURL + props.value
//           : props.value,
//     };
//   }

//   handleImageUpload = (path, type) => {
//     this.setState({
//       FileData: this.props.addFile ? defaultImage : path,
//     });

//     if (this.props.addFile) {
//       this.props.addFile(path, type);
//     }
//   };

//   render() {
//     const { FileData } = this.state;
//     const { isFileContainer = false } = this.props;

//     const actions = [
//       <UploadAction
//         key="upload"
//         fieldName={this.props.fieldName}
//         isFileContainer={isFileContainer}
//         onImageUpload={this.handleImageUpload}
//       />,
//       <BrowserUrlAction
//         key="browser"
//         {...this.props}
//         onImageUpload={this.handleImageUpload}
//       />,
//     ];

//     return (
//       <View>
//       <Controller name={props.fieldName} render={}
//         <ImageParameter
//           {...this.props}
//           value={FileData}
//           defaultValue={
//             this.props.type === "publicImage"
//               ? publicImageURL + this.props.value
//               : this.props.value
//           }
//           actions={actions}
//         />
//         <UploadAction
//           key="upload"
//           fieldName={this.props.fieldName}
//           isFileContainer={isFileContainer}
//           onImageUpload={this.handleImageUpload}
//         />
//         <BrowserUrlAction
//           key="browser"
//           {...this.props}
//           onImageUpload={this.handleImageUpload}
//         />
//       </View>
//     );
//   }
// }

// export default ImageParameterWithPanelActions;
import React, { Component } from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";

import defaultImage from "../../../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";

import BaseInput from "../BaseInput";
import ImageParameter from "../ImageParameter";
import BrowserUrlAction from "./BrowserUrlAction";
import UploadAction from "./UploadAction";

import { publicImageURL } from "../../../../../request";
import convertImageToBase64 from "./ConvertImageToBase64";

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
    const { isFileContainer = false, control, fieldName } = this.props;

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
              <UploadAction
                key="upload"
                fieldName={fieldName}
                isFileContainer={isFileContainer}
                onImageUpload={handleImageUpload}
              />,
              <BrowserUrlAction
                key="browser"
                onImageUpload={handleImageUpload}
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
