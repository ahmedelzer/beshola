import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import ResponsiveContainer from "../../kitchensink-components/auth/layout/ResponsiveContainer";
import PropertyCardDetails from "../cards/PropertyCardDetails";
import GoBackHeader from "../header/GoBackHeader";
import { useSchemas } from "../../../context/SchemaProvider";
import { Text } from "react-native";
import { theme } from "../../Theme";
import PropertyCardButtonsActions from "../cards/PropertyCardButtonsActions";
import CompanyInfo from "./CompanyInfo";
import CompanyCardsFlatList from "./CompanyCardsVirtualized";
import CompanyCardView from "./CompanyCardView";
import { Heading, VStack } from "../../../components/ui";
import { isRTL } from "../../utils/operation/isRTL";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import StarsIcons from "../../utils/component/StarsIcons";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import { useSearch } from "../../../context/SearchProvider";
// import CompanyCardsFlatList from "../cards/CompanyCardsFlatList"; // YOUR LIST OF ITEMS
import PropertyDetailsSchemaActions from "../../Schemas/MenuSchema/PropertyDetailsSchemaActions.json";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import EmptyAssets from "../../utils/component/EmptyAssets";
import AddAsset from "../addAsset/AddAsset";
import LoadingScreen from "../../kitchensink-components/loading/LoadingScreen";
import CompanyProjectCard from "../cards/CompanyProjectCards";

const DetailsScreen = ({ route }) => {
  const [activeTab, setActiveTab] = useState("details"); // details | companyItems

  const localization = useSelector((state) => state.localization.localization);
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);

  const { state } = useSearch();
  const getAction =
    PropertyDetailsSchemaActions &&
    PropertyDetailsSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );
  const dataSourceAPI = (query) =>
    buildApiUrl(query, {
      pageIndex: 1,
      pageSize: 1000,
      [fieldsType.idField]: route.params.id,

      projectRout: getAction.projectProxyRoute,
    });

  const query = dataSourceAPI(getAction);
  const { data: item, error, isLoading } = useFetchWithoutBaseUrl(query);

  // const item = state.rows.find(
  //   (item) => item[fieldsType.idField] === route.params.id,
  // );

  const { menuItemsState } = useSchemas();
  const schemaActions = menuItemsState.actions;
  if (!isLoading && !item) {
    return (
      <EmptyAssets
        message={localization.Hum_screens.ownAsset.noAsset}
        IconComponent={
          <MaterialIcons name={"error-outline"} size={64} color={theme.text} />
        }
        // actionComponent={<AddAsset />}
      />
    );
  }
  return (
    <ResponsiveContainer setMargin={true} style={""}>
      <View className="flex-1 bg-body">
        {/* Header */}
        <GoBackHeader
          subTitle={localization.Hum_screens.menu.details.header.subTitle}
          title={localization.Hum_screens.menu.details.header.title}
        />

        {/* ----------- TOP TABS ----------- */}
        <View className="flex-row px-4 pt-4">
          {/* COMPANY ITEMS TAB */}
          <TouchableOpacity
            onPress={() => setActiveTab("companyItems")}
            className={`flex-1 pb-2 items-center ${
              activeTab === "companyItems"
                ? "!border-accent"
                : "!border-transparent"
            }`}
            style={{
              borderBottomWidth: 3,
              borderBottomColor:
                activeTab === "companyItems" ? theme.accent : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === "companyItems" ? "bold" : "normal",
                color: theme.text,
              }}
            >
              {"Company Information"}
            </Text>
          </TouchableOpacity>
          {/* DETAILS TAB */}
          <TouchableOpacity
            onPress={() => setActiveTab("details")}
            className={`flex-1 pb-2 items-center ${
              activeTab === "details" ? "!border-accent" : "!border-transparent"
            }`}
            style={{
              borderBottomWidth: 3,
              borderBottomColor:
                activeTab === "details" ? theme.accent : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === "details" ? "bold" : "normal",
                color: theme.text,
              }}
            >
              {"Details"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ----------- TAB CONTENT ----------- */}
        <View>{isLoading && <LoadingScreen />}</View>
        {item && (
          <View style={{ flex: 1 }}>
            {activeTab === "details" ? (
              <PropertyCardDetails
                item={item}
                fieldsType={fieldsType}
                schemaActions={schemaActions}
              />
            ) : (
              <View>
                <VStack>
                  <View className={isRTL() ? "items-start" : "items-start"}>
                    {/* Company Name + Verified */}
                    <CompanyInfo fieldsType={fieldsType} item={item} />
                  </View>
                </VStack>
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
            )}
          </View>
        )}
      </View>
    </ResponsiveContainer>
  );
};

export default DetailsScreen;
