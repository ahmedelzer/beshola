import {
  BooleanParameter,
  CheckBoxParameter,
  DateParameter,
  InputPassword,
  MeddleRangeParameter,
  RadioParameter,
  SelectParameter,
  TextParameter,
  RadioListParameter,
  LocationParameter,
  InputWithLabel,
  OtpParameter,
  PhoneNumberParameter,
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
    case "boolean":
      return BooleanParameter;
    case "radio":
      return RadioParameter;
    case "radioList":
      return RadioListParameter;
    case "minMax":
      return MeddleRangeParameter;
    case "password":
    case "confirmPassword":
      return InputPassword;
    case "areaMapLongitudePoint":
    case "mapLongitudePoint":
      return LocationParameter;
    case "inputWithLabel":
    case "additionalInputWithLabel":
      return InputWithLabel;
    case "otp":
      return OtpParameter;
    case "phoneNumber":
      return PhoneNumberParameter;
    default:
      return TextParameter;
  }
}
