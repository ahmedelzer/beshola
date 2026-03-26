import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import DisplayFilesServerSchema from "../../../../Schemas/MenuSchema/DisplayFilesServerSchema.json";
import { getField } from "../../../../utils/operation/getField";
class ServerUploadAction extends React.Component {
  openServerGallery = async () => {
    this;
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: this.props.isFileContainer ? 0 : 1,
    });

    if (result.assets) {
      result.assets.forEach((asset) => {
        this.props.onImageUpload(asset.uri, asset.type);
      });
    }
  };

  render() {
    const parameters =
      DisplayFilesServerSchema?.dashboardFormSchemaParameters ?? [];

    const displayFilesServerFieldsTypes = {
      imageView: getField(parameters, "image"),
      imageStatus: getField(parameters, "imageStatus"),
    };
    return (
      <Pressable onPress={this.openServerGallery}>
        <Ionicons name="cloud-upload-outline" size={24} />
      </Pressable>
    );
  }
}

export default ServerUploadAction;
// import React from "react";
// import { TouchableOpacity, StyleSheet, Alert } from "react-native";
// // Use lucide-react-native for the same LuUpload look
// import { Ionicons } from "@expo/vector-icons";
// import { launchImageLibrary } from "react-native-image-picker";
// import { uploadActionStyle } from "./styles";

// const UploadAction = (props) => {
//   const { onImageUpload, isFileContainer, fieldName } = props;

//   const handlePickImage = async () => {
//     const options = {
//       mediaType: "photo",
//       // selectionLimit: 0 allows multiple if isFileContainer is true (0 = no limit)
//       selectionLimit: isFileContainer ? 0 : 1,
//       includeBase64: false,
//     };

//     try {
//       const result = await launchImageLibrary(options);

//       if (result.didCancel) {
//         return;
//       }

//       if (result.errorCode) {
//         Alert.alert("Error", result.errorMessage);
//         return;
//       }

//       // Loop through assets (handles single or multiple)
//       if (result.assets) {
//         result.assets.forEach((asset) => {
//           // In RN, asset.uri is the equivalent of URL.createObjectURL
//           // asset.type is the mime type (e.g., 'image/jpeg')
//           onImageUpload(asset.uri, asset.type);
//         });
//       }
//     } catch (error) {
//       console.error("ImagePicker Error: ", error);
//     }
//   };

//   return (
//     <TouchableOpacity
//       onPress={handlePickImage}
//       style={[styles.label, uploadActionStyle?.label]}
//       accessibilityLabel={`Upload image for ${fieldName}`}
//     >
//       <Ionicons
//         name="cloud-upload-outline"
//         color="#000" // Adjust color to match your theme
//         style={uploadActionStyle?.icon}
//       />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   label: {
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     // Add your base styling here
//   },
// });

// export default UploadAction;
