import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import staticLocalization from "../../../context/staticLocalization.json";
import LocalizationSchemaActions from "../../Schemas/Localization/LocalizationSchemaActions.json";
import {
  setLanguageRow,
  setLocalization,
  updateCurrentLanguage,
} from "../../reducers/localizationReducer";
import { DeepMerge } from "./DeepMerge";
import schemaLanguages from "../../Schemas/LanguageSchema/LanguageSchema.json";
import pcLang from "./pcLang.json";
const useLocalizationPolling = () => {
  const dispatch = useDispatch();
  const languageRow = useSelector((state) => state.localization.languageRow);
  const langCode = (navigator.language || "en").split("-")[0];
  const prams = schemaLanguages.dashboardFormSchemaParameters;

  const languageName = prams.find(
    (p) => p.parameterType === "Language",
  ).parameterField;
  const direction = prams.find(
    (p) => p.parameterType === "Direction",
  ).parameterField;
  const getLocalizationAction = LocalizationSchemaActions?.find(
    (action) => action.dashboardFormActionMethodType === "Get",
  );

  const currentLang =
    languageRow?.[languageName] || pcLang[langCode].matches[0];
  const currentDir = languageRow?.[direction] || pcLang[langCode].isRTL;
  useEffect(() => {
    if (currentLang && Object.keys(languageRow).length === 0) {
      dispatch(updateCurrentLanguage(currentLang));
      dispatch(setLanguageRow({ ...languageRow, [direction]: currentDir }));
    }
  }, []);
  // useFetch handles fetching
  const { data: localization } = useFetch(
    currentLang
      ? `/${getLocalizationAction?.routeAdderss}/${currentLang}/BrandingMartE-Shop`
      : null,
    schemaLanguages.projectProxyRoute,
  );

  useEffect(() => {
    if (!localization) return;

    const localFormat = localization.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
    const dataObject = JSON.parse(localFormat);
    delete dataObject._id;

    const merged = DeepMerge(staticLocalization, dataObject);

    dispatch(
      setLocalization(typeof merged === "string" ? JSON.parse(merged) : merged),
    );
  }, [localization, dispatch]);
};

export default useLocalizationPolling;
