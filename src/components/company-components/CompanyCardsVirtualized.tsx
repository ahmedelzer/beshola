import React, { useMemo, useRef } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { useSchemas } from "../../../context/SchemaProvider";
import { getItemPackage } from "./getItemPackage";
import CompanyCard from "../cards/CompanyCard";

interface CompanyCardsFlatListProps {
  rows?: any[];
  fieldsType: any;
  cartState: any;
  menuItemsState: any;
  selectedItems?: any[];
  setSelectedItems?: (items: any[]) => void;
  CardComponent?: React.ComponentType<{
    itemPackage: any;
    selectedItems?: any[];
    setSelectedItems?: (items: any[]) => void;
    schemaActions: any;
  }>;
}

const chunkArray = (arr: any[], size: number) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const CompanyCardsFlatList: React.FC<CompanyCardsFlatListProps> = ({
  rows = [],
  fieldsType,
  cartState,
  menuItemsState,
  selectedItems = [],
  setSelectedItems,
  CardComponent = CompanyCard, // default fallback
}) => {
  const { width } = useWindowDimensions();


  const numColumns = useMemo(() => {
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
  }, [width]);

  const GAP = 16;
  const PADDING_HORIZONTAL = 16;

  const { cellWidth, cellHeight, suggestionWidth } = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const totalPadding = PADDING_HORIZONTAL * 4 + 3;
    const availableWidth = width - totalGap - totalPadding;
    const cw = availableWidth / numColumns;
    return {
      cellWidth: cw,
      cellHeight: cw * 1.05,
      suggestionWidth: availableWidth,
    };
  }, [width, numColumns]);

  const displayRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    const chunked = chunkArray(rows, numColumns);
    const out: any[] = [];
    chunked.forEach((rowItems, rowIndex) => {
      out.push({ type: "row", items: rowItems, rowIndex });
      if ((rowIndex + 1) % 2 === 0) {
        out.push({ type: "suggestion", rowIndex });
      }
    });
    return out;
  }, [rows, numColumns]);

  const renderRow = ({ item }: { item: any }) => {
    if (item.type === "row") {
      return (
        <View style={{ flexDirection: "row", marginBottom: GAP, gap: GAP }}>
          {item.items.map((rowItem: any, idx: number) => (
            <View
              key={`${rowItem[fieldsType.idField] ?? idx}-${idx}`}
              style={{ width: numColumns === 1 ? "100%" : cellWidth }}
            >
              <CardComponent
                itemPackage={getItemPackage(
                  rowItem,
                  cartState.rows,
                  menuItemsState.schema,
                  fieldsType,
                )}
                schemaActions={menuItemsState.actions}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
            </View>
          ))}

          {item.items.length < numColumns &&
            Array.from({ length: numColumns - item.items.length }).map(
              (_, k) => (
                <View
                  key={`placeholder-${k}`}
                  style={{
                    width: cellWidth,
                    marginLeft: GAP,
                    opacity: 0,
                  }}
                />
              ),
            )}
        </View>
      );
    }
    return null;
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const ids: string[] = [];
    viewableItems.forEach((vi: any) => {
      if (vi.item.type === "row") {
        ids.push(
          ...vi.item.items.map((rowItem: any) => rowItem[fieldsType.idField]),
        );
      }
    });
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  return (
    <FlatList
      data={displayRows}
      renderItem={renderRow}
      keyExtractor={(entry, i) =>
        entry.type === "row"
          ? `row-${entry.rowIndex}`
          : `suggest-${entry.rowIndex}-${i}`
      }
      numColumns={1}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      key={numColumns}
      removeClippedSubviews
      initialNumToRender={2}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={100}
      windowSize={7}
    />
  );
};

export default CompanyCardsFlatList;
