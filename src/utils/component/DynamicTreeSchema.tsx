import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

import Tree from "../../components/forms/DynamicTree/Tree";
import {
  defaultProjectProxyRoute,
  defaultProjectProxyRouteWithoutBaseURL,
} from "../../../request";
import { fetchData } from "../../../components/hooks/APIsFunctions/useFetch";
import BaseTree from "./BaseTree";
import { useFormContext } from "react-hook-form";
import { useSearch } from "../../../context/SearchProvider";
const testSchema = {
  dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
  schemaType: "Table",
  idField: "attributeID",
  dashboardFormSchemaInfoDTOView: {
    dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
    schemaHeader: "Attribute",
    addingHeader: "Add Attribute",
    editingHeader: "Edit Attribute",
  },
  dashboardFormSchemaParameters: [
    {
      dashboardFormSchemaParameterID: "dcd85c5d-0736-41e6-90b4-712fcc81960d",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "attributeID",
      parameterTitel: "Attribute ID",
      parameterLookupTitel: "Attribute ID",
      isIDField: true,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 1,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
    {
      dashboardFormSchemaParameterID: "e16f5661-96af-439d-8bc7-c465ecb8b31f",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "attributeName",
      parameterTitel: "Attribute Name",
      parameterLookupTitel: null,
      isIDField: false,
      lookupID: "188a7178-8a86-40bb-a127-0ec49b0b9b9d",
      lookupReturnField: "attributeValueID",
      lookupDisplayField: "attributeValue",
      indexNumber: 2,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
  ],
  projectProxyRoute: "BrandingMartDefinitions",
  isMainSchema: true,
  dataSourceName: "string",
  propertyName: "string",
  indexNumber: 0,
};
type DynamicTreeSchemaProps = {
  schema?: typeof testSchema;
  selectedRow?: Record<string, any>;
  fieldName?: string;
  control?: any;
  filtersMap?: Record<string, any>;
  value?: any;
  setValue?: any;
};

const DynamicTreeSchema = ({
  schema = testSchema,
  selectedRow = {},
  fieldName,
  control,
  filtersMap,
  value = [],
  setValue,
}: DynamicTreeSchemaProps) => {
  type SchemaType = typeof testSchema;
  const [subSchemas, setSubSchemas] = useState<SchemaType[]>([]);
  const [parentRow, setParentRow] = useState(value);
  // const { setValue } = useFormContext();

  // prevent duplicate fetch
  const visitedLookups = useRef(new Set());

  const GetSubSchemas = async (currentSchema: typeof testSchema | null) => {
    if (!currentSchema) return;

    const columns = currentSchema.dashboardFormSchemaParameters || [];

    const firstLookupColumn = columns.find((col) => {
      console.log("col.lookupID ", col.lookupID, col.parameterType);
      return col.lookupID;
    });

    if (!firstLookupColumn) return;

    const lookupID = firstLookupColumn.lookupID;

    // prevent duplicate calls
    if (visitedLookups.current.has(lookupID)) return;

    visitedLookups.current.add(lookupID);

    try {
      const { data, error } = await fetchData(
        `/Dashboard/GetDashboardFormSchemaBySchemaID?DashboardFormSchemaID=${lookupID}`,
        defaultProjectProxyRouteWithoutBaseURL,
      );

      if (error || !data) return;

      const schemas = Array.isArray(data) ? data : [data];

      for (const schemaItem of schemas) {
        setSubSchemas((prev) => [...prev, schemaItem]);

        // recursive load
        await GetSubSchemas(schemaItem);
      }
    } catch (err) {
      console.error("Schema fetch error:", err);
    }
  };

  useEffect(() => {
    const loadSchemas = async () => {
      setSubSchemas([]);
      visitedLookups.current.clear();

      await GetSubSchemas(schema);
    };

    loadSchemas();
  }, [schema]);
  console.log("====================================");
  console.log(parentRow, "parentRow");
  console.log("====================================");
  useEffect(() => {
    setValue(fieldName, parentRow);
  }, [parentRow, fieldName, setValue]);
  return (
    <View>
      {schema && (
        <BaseTree
          // key={schema?.idField}
          schema={schema}
          onLeafCheckChange={() => {
            console.log("====================================");
            console.log("onLeafCheckChange", "");
            console.log("====================================");
          }}
          onRowClick={() => {
            console.log("====================================");
            console.log("onRowClick", "");
            console.log("====================================");
          }}
          // selectedRow={selectedRow}
          subSchemas={subSchemas}
          setParentRow={setParentRow}
          filtersMap={filtersMap}
          fieldName={fieldName}
        />
      )}
    </View>
  );
};

export default DynamicTreeSchema;
