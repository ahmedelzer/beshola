import {
  BooleanParameter,
  ButtonInput,
  CalendarParameter,
  CheckBoxParameter,
  DateParameter,
  DynamicRangeComponent,
  DynamicTreeSchema,
  ImageParameterWithPanelActions,
  InputPassword,
  InputWithLabel,
  ListOfKeywordsParameter,
  LocationParameter,
  LookupParameter,
  MiddleRangeParameter,
  OtpParameter,
  PhoneNumberParameter,
  RadioListParameter,
  RadioParameter,
  SelectParameter,
  StartEndTimeParameter,
  TextParameter,
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
    case "calender":
      return CalendarParameter;
    case "startTime":
      // case "endTime":
      return StartEndTimeParameter;
    case "datetime":
    case "date":
    case "birthday":
    case "pushTime":
      return DateParameter;
    case "image":
    case "publicImage":
    case "imagePath":
      return ImageParameterWithPanelActions;
    // case "imagePath":
    //   return ImagePathParameter;
    case "boolean":
      return BooleanParameter;
    case "radio":
      return RadioParameter;
    case "radioList":
      return RadioListParameter;
    case "button":
    case "detailsCell":
      return ButtonInput;
    case "tree":
      return DynamicTreeSchema;
    case "lookup":
      return LookupParameter;
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
