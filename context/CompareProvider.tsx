import React, { createContext, useState, ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isRTL } from "../src/utils/operation/isRTL";
import RedCounter from "../src/utils/component/RedCounter";
import { theme } from "../src/Theme";
import { useNavigation, useRoute } from "@react-navigation/native";

interface CompareProviderType {
  compareItems: any[];
  setCompareItems: React.Dispatch<React.SetStateAction<any>>;
  displayCompare: boolean;
  handleCompareToggle: (item: any, fieldsType: any) => void;
  isCompareItem: (item: any, fieldsType: any) => boolean;
  setDisplayCompare: React.Dispatch<React.SetStateAction<any>>;
}

export const CompareContext = createContext<CompareProviderType>({
  compareItems: [],
  displayCompare: true,
  handleCompareToggle: () => {},
  isCompareItem: () => false,
  setDisplayCompare: () => false,
  setCompareItems: () => false,
});

export const CompareProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [displayCompare, setDisplayCompare] = useState(true);
  const navigation = useNavigation();

  const isCompareItem = (item: any, fieldsType: any) => {
    const id = item?.[fieldsType.idField];
    return compareItems.some((i) => i?.[fieldsType.idField] === id);
  };

  const handleCompareToggle = (item: any, fieldsType: any) => {
    const id = item?.[fieldsType.idField];

    if (!id) return;

    setCompareItems((prev) => {
      const exists = prev.some((i) => i?.[fieldsType.idField] === id);
      return exists
        ? prev.filter((i) => i?.[fieldsType.idField] !== id)
        : [...prev, item];
    });
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        handleCompareToggle,
        isCompareItem,
        displayCompare,
        setDisplayCompare,
        setCompareItems,
      }}
    >
      {/* Only show button if there are items and displayCompare is true */}
      {compareItems.length > 0 && displayCompare && (
        <TouchableOpacity
          onPress={() => navigation.navigate("CompareScreen")}
          style={{
            position: "absolute",
            bottom: 50,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.accent,
            alignItems: "center",
            justifyContent: "center",
            elevation: 6,
            zIndex: 999,
            right: isRTL() ? 20 : undefined,
            left: !isRTL() ? 20 : undefined,
          }}
        >
          <MaterialCommunityIcons name="compare" size={26} color={theme.body} />
          <RedCounter
            count={compareItems.length}
            colors={{
              backgroundColor: theme.error,
              color: theme.body,
            }}
          />
        </TouchableOpacity>
      )}

      {children}
    </CompareContext.Provider>
  );
};
