import { View, Text } from "react-native";
import React from "react";
import { VStack } from "../../../components/ui";
import { isRTL } from "../../utils/operation/isRTL";
import CompanyInfo from "./uiComponent/CompanyInfo";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import { theme } from "../../Theme";
import { onApply } from "../form-container/OnApply";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import CompanyDetailsInfoSchemaActions from "../../Schemas/MenuSchema/CompanyDetailsInfoSchemaActions.json";
import { ScrollView } from "react-native-gesture-handler";

export default function CompanyDetailsInfo({ fieldsType, item }) {
  const getAction =
    CompanyDetailsInfoSchemaActions &&
    CompanyDetailsInfoSchemaActions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "get",
    );
  const dataSourceAPIToGetWorkingHours = (query) => {
    return buildApiUrl(query, {
      ...item,
    });
  };
  const { data, error, isLoading } = useFetchWithoutBaseUrl(
    dataSourceAPIToGetWorkingHours(getAction),
  );

  //   const workingHours = data.daysWorkingHours;
  //   const contacts = data.contacts;
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            alignItems: isRTL() ? "flex-end" : "flex-start",
          }}
        >
          {data && <CompanyInfo branches={data} />}
        </View>

        {/* Information & Reviews Section */}
        <View className="w-full p-1 mt-2 rounded-xl shadow-sm bg-accent/10">
          <CollapsibleSection
            title={"Information && Reviews"}
            iconColor={theme.accent}
            textColor={theme.accent}
          >
            {/* We wrap child in a View, NO scrollview here */}
            <View style={{ width: "100%" }}>
              <CompanyInfo branches={data} />
            </View>
          </CollapsibleSection>
        </View>
      </VStack>
    </ScrollView>
  );
}
