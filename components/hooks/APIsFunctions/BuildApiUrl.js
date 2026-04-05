import { GetProjectUrl } from "../../../request";
import { selectSelectedNode } from "../../../src/reducers/LocationReducer";
import { store } from "../../../src/store/reduxStore";
import { clientID } from "../../../request";
import { mapMessage } from "./MapMessage";
//import store from "./store";

export function buildApiUrl(
  apiRequest,
  baseConstants,
  getProjectUrl = GetProjectUrl(apiRequest.projectProxyRoute),
) {
  const selectedNode = selectSelectedNode(store.getState());
  const selectedLocation = store.getState().location.selectedLocation;
  const serviceIndex = store.getState().location.selectedTab;
  const languageRow = store.getState().localization.languageRow;
  const constants = {
    ...baseConstants,
    ...languageRow,
    ...selectedNode,
    ...selectedLocation,
    clientID: clientID,
    serviceIndex: serviceIndex,
  };
  if (!apiRequest || !apiRequest.dashboardFormSchemaActionQueryParams) {
    // Handle the case where apiRequest is null or does not have dashboardFormSchemaActionQueryParams
    return null; // or some default value or throw an error, depending on your use case
  }
  const routeAddress = apiRequest.routeAdderss;
  // const queryParam = apiRequest.dashboardFormSchemaActionQueryParams
  //   .filter(
  //     (param) =>
  //       param.IsRequired || constants[param.dashboardFormParameterField],
  //   )
  //   .map(
  //     (param) =>
  //       `${param.parameterName}=${constants[param.dashboardFormParameterField]}`,
  //   )
  //   .join("&");
  const queryParts = [];

  for (const param of apiRequest.dashboardFormSchemaActionQueryParams) {
    const newKey = param.dashboardFormParameterField;
    // param.dashboardFormParameterField.charAt(0).toLowerCase() +
    // param.dashboardFormParameterField.slice(1);

    const value = constants[newKey];

    // ❌ If required and no value → return null immediately
    if (
      param.isRequired &&
      (value === undefined || value === null || value === "")
    ) {
      console.log("❌ Missing required param:", param.parameterName);
      // throw new Error(`Missing required parameter: ${param.parameterName}`);
      return null; // 🔥 STOP everything
    }

    // ✅ If has value → include it
    if (value !== undefined && value !== null && value !== "") {
      queryParts.push(`${param.parameterName}=${value}`);
    }
  }

  const queryParam = queryParts.join("&");
  const apiUrl = `${getProjectUrl}/${mapMessage(routeAddress, constants)}${
    routeAddress.includes("?") ? "&" : "?"
  }${queryParam}`;

  //const apiUrl = `${getProjectUrl}/${apiRequest.routeAdderss}?${queryParam}`;
  return apiUrl;
}
