export function CreateInputProps(param, value) {
 
  let props = {
    fieldName: param.parameterField,
    title: param.parameterTitel,
    value: value,
    values: param.values,
    enable: param.isEnable,
    type: param.parameterType,
    showTitle:
      param.parameterType.includes("WithLabel") || param.parameterType == "otp"
        ? false
        : true,
  };

  if (param.lookupID) {
    const additionProps = {
      lookupDisplayField: param.lookupDisplayField,
      lookupID: param.lookupID,
      lookupReturnField: param.lookupReturnField,
      dashboardFormSchemaParameterID: param.dashboardFormSchemaParameterID,
      
    };
    props = { ...props, ...additionProps };
  }
  return props;
}
