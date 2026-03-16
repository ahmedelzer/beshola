import {
  BooleanParameter,
  CheckBoxParameter,
  DateParameter,
  InputPassword,
  MiddleRangeParameter,
  RadioParameter,
  SelectParameter,
  TextParameter,
  RadioListParameter,
  LocationParameter,
  InputWithLabel,
  OtpParameter,
  PhoneNumberParameter,
  ImageParameterWithPanelActions,
  DynamicTreeSchema,
  DynamicRangeComponent,
  ListOfKeywordsParameter,
} from "./index";
export function GetInputComponent(type) {
  switch (type) {
    case "text":
    case "float":
    case "numeric":
      return TextParameter;
    case "select":
      return SelectParameter;
    case "checkBox":
      return CheckBoxParameter;
    case "datetime":
    case "date":
    case "birthday":
    case "pushTime":
      return DateParameter;
    case "image":
    case "publicImage":
      return ImageParameterWithPanelActions;
    case "boolean":
      return BooleanParameter;
    case "radio":
      return RadioParameter;
    case "radioList":
      return RadioListParameter;
    case "tree":
      return DynamicTreeSchema;
    case "dynamicRange":
      return DynamicRangeComponent;
    case "range":
    case "minmax":
      return MiddleRangeParameter;
    case "password":
    case "confirmPassword":
      return InputPassword;
    case "areaMapLongitudePoint":
    case "mapLongitudePoint":
      return LocationParameter;
    case "inputWithLabel":
    case "additionalInputWithLabel":
      return InputWithLabel;
    case "listOfKeywords":
      return ListOfKeywordsParameter;
    case "otp":
      return OtpParameter;
    case "phoneNumber":
      return PhoneNumberParameter;
    default:
      return TextParameter;
  }
}
