import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageSchema from "./src/Schemas/LanguageSchema/LanguageSchema.json";
import NearestBranchesSchema from "./src/Schemas/AddressLocation/NearestBranches.json";
import { retrieveSecureValue } from "./src/store/secureStore";
import { getField } from "./src/utils/operation/getField";
import {
  selectCurrentLocation,
  selectSelectedLocation,
  selectSelectedNode,
} from "./src/reducers/LocationReducer";
import { store } from "./src/store/reduxStore";

//export const domainURL = "https://maingatewayapi.ihs-solutions.com:8000";
//export const domainURL = "41.196.0.25";
export const domainURL = "ihs-solutions.com";
export const baseURL = "https://" + domainURL;
export const defaultProjectProxyRouteWithoutBaseURL = `Centralization`;

export const defaultCentralizationProxyRoute =
  "https://" + domainURL + "/Centralization/api";
export const defaultProjectProxyRoute = `${baseURL}/BrandingMart/api/`;
export const defaultProjectProxyRouteWithoutAPI = `${baseURL}/BrandingMart/`;
export const publicImageURL = "https://" + domainURL + ":5055/";
export let isOnline = true;

//export const publicImageURL = "https://ihs-solutions.com:5055/";
//export const websocketBaseURI =
// "wss://maingatewayapi.ihs-solutions.com:8000/Chanels";
export const websocketBaseURI = "wss://" + domainURL + ":9001";
// export const languageName = window.localStorage.getItem("language");
// export const languageID = window.localStorage.getItem("languageID");
// export const projectProxyRoute =
//   window.sessionStorage.getItem("projectProxyRoute");//!make it by storge
// export let projectProxyRoute = "BrandingMart";

export function SetIsOnline(state) {
  isOnline = state;
}

// Add other methods as needed

export var baseURLWithoutApi = `${baseURL}`;
export const clientID = "d3804355-a09c-46ec-910c-dc024a4bae1b";
//"proxy": "http://ihs.ddnsking.com:8000",

export function GetProjectUrl(projectProxyRoute) {
  baseURLWithoutApi = `${baseURL}/${projectProxyRoute}`;
  return `${baseURL}/${projectProxyRoute}/api`;
}
export async function GetToken() {
  return await retrieveSecureValue("token");
}
export async function SetHeaders() {
  const langField = getField(
    LanguageSchema.dashboardFormSchemaParameters,
    "Language",
  );
  const displayLookupParam =
    NearestBranchesSchema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayLookup",
    );
  const selectedNode = selectSelectedNode(store.getState());

  const languageRow = await AsyncStorage.getItem("languageRow");

  const coords = selectCurrentLocation(store.getState());

  const languageRowObj =
    typeof languageRow === "string" ? JSON.parse(languageRow) : languageRow;
  const languageValue = String(languageRowObj?.[langField] ?? "Eng_US");
  const headers = {
    languageName: encodeURIComponent(languageValue),
    "Content-Type": "application/json",
    [displayLookupParam.lookupReturnField]:
      selectedNode?.[displayLookupParam.lookupReturnField] || "",
    token: await GetToken(),
    clientID: clientID,
    LocationLatitudePoint: coords?.latitude,
    LocationLongtudePoint: coords?.longitude,
    ...(languageRowObj && Object.keys(languageRowObj).length > 0
      ? Object.fromEntries(
          Object.entries(languageRowObj).map(([k, v]) => [
            k,
            String(encodeURIComponent(v)),
          ]),
        )
      : {}),
  };

  // Remove any undefined or null properties
  Object.keys(headers).forEach(
    (key) =>
      (headers[key] === undefined || headers[key] === null) &&
      delete headers[key],
  );

  return headers;
}

export const request = axios.create({
  // baseURL: baseURL,
  // headers: {
  //   ...SetHeaders(),
  // },
  // withCredentials: true,
});
