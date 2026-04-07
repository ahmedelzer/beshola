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
  console.log("data", data);
  //   const workingHours = data.daysWorkingHours;
  //   const contacts = data.contacts;
  return (
    <View>
      <VStack>
        <View className={isRTL() ? "items-start" : "items-start"}>
          {/* Company Name + Verified */}
          {data && <CompanyInfo branches={data} masterBranch={data?.[0]} />}
        </View>
      </VStack>
      <View className="flex-row flex-wrap justify-center items-center gap-3"></View>
      <View className="w-full p-1 rounded-xl shadow-sm bg-accent/10">
        {/* <CollapsibleSection
                    title={"Projects"}
                    iconColor={theme.accent}
                    textColor={theme.accent}
                    defaultExpandedSection={true}
                  >
                    <CompanyCardsFlatList
                    rows={initCompanyRows}
                    fieldsType={fieldsType}
                    cartState={{ rows: [] }}
                    menuItemsState={menuItemsState}
                    CardComponent={CompanyCardView}
                  />
                  </CollapsibleSection> */}
      </View>
      <View className="w-full p-1 mt-2 rounded-xl shadow-sm bg-accent/10">
        <CollapsibleSection
          title={"Information && Reviews"}
          iconColor={theme.accent}
          textColor={theme.accent}
        >
          <CompanyInfo fieldsType={fieldsType} item={item} />
        </CollapsibleSection>
      </View>
    </View>
  );
}
