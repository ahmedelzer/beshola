import { View, Text } from "react-native";
import React, { useState } from "react";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import AssetsSchemaActions from "../../Schemas/MenuSchema/AssetsSchemaActions.json";
import { useTab } from "../../../context/TabsProvider";
import SchemaTabs from "../../utils/component/SchemaTabs";
import { usePreloadList } from "../Pagination/usePreloadList";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { scale } from "react-native-size-matters";
const testSchemaGetAction = {
  projectProxyRoute: "BrandingMartAssets",
  dashboardFormSchemaActionID: "46ac8869-4745-41c8-8839-d02dfe9999f0",
  dashboardFormActionMethodType: "Get",
  routeAdderss: "Asset/GetOnlineAssetsAreas",
  body: "",
  returnPropertyName: "dataSource",
  dashboardFormSchemaActionQueryParams: [
    {
      dashboardFormSchemaActionQueryParameterID:
        "5c060feb-679d-45fe-b48a-4ebce6fec77f",
      dashboardFormSchemaActionID: "e77b4a7b-7ab5-46f7-8240-0da8a3b50a25",
      parameterName: "PageSize",
      IsRequired: true,
      dashboardFormParameterField: "pageSize",
    },
    {
      dashboardFormSchemaActionQueryParameterID:
        "bc7e84f0-42d6-4124-a7e8-587b8ea1d480",
      dashboardFormSchemaActionID: "e77b4a7b-7ab5-46f7-8240-0da8a3b50a25",
      parameterName: "PageNumber",
      IsRequired: true,
      dashboardFormParameterField: "pageIndex",
    },

    {
      dashboardFormSchemaActionQueryParameterID:
        "bc7e84f0-42d6-4124-a7e8-587b8ea1d480",
      dashboardFormSchemaActionID: "e77b4a7b-7ab5-46f7-8240-0da8a3b50a25",
      parameterName: "ServiceID",
      IsRequired: false,
      dashboardFormParameterField: "serviceID",
    },
    {
      dashboardFormSchemaActionQueryParameterID:
        "bc7e84f0-42d6-4124-a7e8-587b8ea1d480",
      dashboardFormSchemaActionID: "e77b4a7b-7ab5-46f7-8240-0da8a3b50a25",
      parameterName: "AccountID",
      IsRequired: false,
      dashboardFormParameterField: "accountID",
    },
  ],
};
const testSchema = {
  dashboardFormSchemaID: "e77b4a7b-7ab5-46f7-8240-0da8a3b50a25",
  schemaType: "servicesAreas",
  idField: "areaID",
  dashboardFormSchemaParameters: [
    {
      parameterType: "assetID",
      parameterField: "areaID",
      parameterTitel: "Asset ID",
      isIDField: true,
      isEnable: true,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      isFilterOperation: true,
      dashboardFormSchemaParameterDependencies: [],
      indexNumber: 1,
    },
    {
      parameterType: "areaName",
      parameterField: "areaName",
      parameterTitel: "Area Name",
      isIDField: false,
      isEnable: true,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      isFilterOperation: true,
      dashboardFormSchemaParameterDependencies: [],
      indexNumber: 2,
    },
  ],
};
export default function CompanyProjectCard({ item }) {
  const [activeAreaTab, setActiveAreaTab] = useState(0);
  const addAssetDataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...item,
    });
  };

  const { rows, totalCount, loading, handleScroll } = usePreloadList({
    idField: testSchema.idField,
    getAction: testSchemaGetAction,
    dataSourceAPI: addAssetDataSourceAPI,
    deps: [],
  });

  return (
    <View className="w-full p-1 rounded-xl">
      <SchemaTabs
        activeTab={activeAreaTab}
        setActiveTab={setActiveAreaTab}
        fieldsType={{
          id: testSchema.idField,
          title: "areaName",
        }}
        params={rows}
      />
      <SuggestCardContainer
      imageScale={scale(150)}
      variant=""
        schemaActions={AssetsSchemaActions}
       row={{
  ...item,
  ...(rows?.[activeAreaTab]?.testSchema?.idField && {
    areaIDs: [rows[activeAreaTab].testSchema.idField],
  }),
}}
        suggestContainerType={0}
      />
    </View>
  );
}
