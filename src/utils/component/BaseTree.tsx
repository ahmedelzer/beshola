import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { View, Text, Pressable, Switch, FlatList } from "react-native";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../request";
import ListOfKeywordsParameter from "../../components/form-container/inputs/ListOfKeywordsParameter";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import reducer from "../../components/Pagination/reducer";
import { initialState } from "../../components/Pagination/initialState";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../components/Pagination/updateRows";
import { string } from "yup";
import { theme } from "../../Theme";
import { MaterialIcons } from "@expo/vector-icons";

const VIRTUAL_PAGE_SIZE = 50;

const BaseTree = ({
  schema,
  rowDetails = {},
  subSchemas = [],
  onRowClick,
  onLeafCheckChange,
  canUnchecked = false,
  canChecked = false,
  values = [],
  lookupDisplayField = "label",
  lookupReturnField = "value",
  setParentRow,
  parentID,
  filtersMap,
  fieldName,
  setValue,
}) => {
  const { data: _schemaActions } = useFetch(
    GetSchemaActionsUrl(schema.dashboardFormSchemaID),
    defaultProjectProxyRouteWithoutBaseURL,
  );

  const getAction =
    _schemaActions &&
    _schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [state, dispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, schema.idField),
  );

  const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

  const dataSourceAPI = (query, skip, take) =>
    buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...rowDetails,
    });

  useEffect(() => {
    if (!getAction) return;

    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction, rowDetails]);
  const toggleExpand = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId],
    );
    console.log("rowId", schema, rowId, expandedRows);
  };

  const columns = useMemo(() => {
    if (!schema?.dashboardFormSchemaParameters) return [];

    return schema.dashboardFormSchemaParameters
      .filter((param) => !param.isIDField)
      .map((param) => ({
        name: param.parameterField,
        title: param.parameterTitel,
        type: param.parameterType,
        lookupID: param.lookupID,
        lookupDisplayField: param.lookupDisplayField,
        lookupReturnField: param.lookupReturnField,
      }));
  }, [schema]);

  const handleCheck = (row, keywords) => {
    if (onLeafCheckChange) {
      onLeafCheckChange({
        row,
        keywords,
      });
    }
  };
  const isLeaf = !subSchemas || subSchemas.length === 0;
  const renderChildrenSchemas = (row) => {
    if (!subSchemas || subSchemas.length === 0) return null;
    const col = schema.dashboardFormSchemaParameters.find(
      (param) => param.lookupID,
    );
    return subSchemas.map((childSchema) => (
      <View key={childSchema.dashboardFormSchemaID} className="mt-2 ps-4 ms-10">
        <BaseTree
          schema={childSchema}
          rowDetails={{ ...rowDetails, ...row }}
          subSchemas={childSchema.subSchemas || []}
          onRowClick={onRowClick}
          onLeafCheckChange={onLeafCheckChange}
          values={values}
          lookupDisplayField={col.lookupDisplayField}
          lookupReturnField={col.lookupReturnField}
          setParentRow={setParentRow}
          parentID={row[schema.idField]}
          filtersMap={filtersMap}
          fieldName={fieldName}
          setValue={setValue}
        />
      </View>
    ));
  };
  const renderRow = ({ item: row }) => {
    const rowId = row[schema.idField];
    const expanded = expandedRows.includes(rowId);

    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.accent }}>
        <Pressable
          onPress={() => {
            setSelectedRow(row);
            onRowClick?.(row);
            toggleExpand(rowId);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 10,
            backgroundColor: theme.body,
          }}
        >
          {/* Expand Icon */}
          {!isLeaf && (
            <Pressable
              onPress={() => toggleExpand(rowId)}
              style={{
                marginRight: 10,
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                backgroundColor: theme.card,
              }}
            >
              <MaterialIcons
                name={expanded ? "expand-more" : "chevron-right"}
                size={22}
                color={theme.accent}
              />
            </Pressable>
          )}

          {/* Columns */}
          {!isLeaf &&
            columns.map((col) => (
              <View key={col.name} style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme.accent,
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {row[col.name]}
                </Text>
              </View>
            ))}
        </Pressable>

        {/* Children */}
        {expanded && renderChildrenSchemas(row)}
      </View>
    );
  };
  const RenderKeyWords = ({ values, setParentRow }) => {
    return (
      <View style={{ flex: 1 }}>
        <ListOfKeywordsParameter
          values={values}
          lookupDisplayField={lookupDisplayField}
          lookupReturnField={lookupReturnField}
          setParentRow={setParentRow}
          parentID={parentID}
          filtersMap={filtersMap}
          fieldName={fieldName}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        borderColor: theme.accent,
        borderRadius: 6,
        marginBottom: 10,
      }}
    >
      {isLeaf ? (
        <RenderKeyWords values={state.rows} setParentRow={setParentRow} />
      ) : (
        <FlatList
          data={state.rows}
          keyExtractor={(item) => String(item[schema.idField])}
          renderItem={renderRow}
        />
      )}
    </View>
  );
};
export default BaseTree;
