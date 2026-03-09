import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import staticLocalization from "./staticLocalization.json";
import useFetch from "../components/hooks/APIsFunctions/useFetch";
import pcLang from "../src/components/language/pcLang.json";
import schemaLanguages from "../src/Schemas/LanguageSchema/LanguageSchema.json";
import LocalizationSchemaActions from "../src/Schemas/Localization/LocalizationSchemaActions.json";
import { DeepMerge } from "../src/components/language/DeepMerge";
import {
  setLanguageRow,
  setLocalization,
  updateCurrentLanguage,
} from "../src/reducers/localizationReducer";
import RNRestart from "react-native-restart";
import { I18nManager, StyleSheet, Text, View } from "react-native";

import LoadingScreen from "../src/kitchensink-components/loading/LoadingScreen";
import { Image } from "react-native";
import { Platform } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
// Define context type
interface LocalizationContextType {
  languageRow: object;
  setLanguageRow: React.Dispatch<React.SetStateAction<object>>;
  languageID: string;
  setLanguageID: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
export const LocalizationContext = createContext(null);

// LocalizationProvider
export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [_continue, setContinue] = useState<boolean>(true); //be false
  const localizationStorage = useSelector(
    (state) => state.localization.localization,
  );
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
    if (Platform.OS === "web") {
      document.documentElement.dir = currentDir ? "rtl" : "ltr";
    } else {
      if (I18nManager.isRTL !== currentDir) {
        I18nManager.forceRTL(currentDir);

        // App reload required
        // RNRestart.restart();
      }
    }
  }, []);
  const { data: localization, error } = useFetch(
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
  const [showLogo, setShowLogo] = useState(true);
  const [showLogoTime, setShowLogoTime] = useState(Date.now());
  const isFinishing = useRef(true);

  // 2. Create individual states for each schema
  const [isEndFinishing, setIsEndFinishing] = useState(false);
  useEffect(() => {
    {
      const elapsed = Date.now() - showLogoTime;

      // wait at least 2 seconds (2000 ms)
      const delay = elapsed >= 2000 ? 0 : 2000 - elapsed;

      const timer = setTimeout(() => {
        if (isFinishing.current && isEndFinishing) setShowLogo(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isFinishing, isEndFinishing, showLogoTime]);
  return (
    <LocalizationContext.Provider
      value={{
        isFinishing,
        isEndFinishing,
        setIsEndFinishing,
      }}
    >
      {/* {_continue ? children : null} */}
      {children}
      {/* Overlay */}
      {showLogo && (
        <View style={styles.loadScreenOverlay}>
          {/* Center Logo */}
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: scale(160),
              height: moderateScale(140),
              resizeMode: "contain",
            }}
          />

          {/* Bottom IHS Logo */}
          <View style={styles.bottomLogoContainer}>
            <Image
              source={require("../assets/display/IHS-logo.jpg")}
              style={styles.ihsLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
    </LocalizationContext.Provider>
  );
};
const styles = StyleSheet.create({
  loadScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 999,
  },

  bottomLogoContainer: {
    position: "absolute",
    bottom: 30, // distance from bottom
    left: 0,
    right: 0,
    alignItems: "center",
  },

  ihsLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
