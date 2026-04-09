import { useContext, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { CompareContext } from "../../../context/CompareProvider";
import { initCompanyRows } from "../../components/company-components/tabsData";
import Searchbar from "../../components/search-bar/Searchbar";
import { theme } from "../../Theme";
import Sheet from "../../utils/component/Sheet";
import { isRTL } from "../../utils/operation/isRTL";
import SheetCard from "./SheetCard";
import { Box, Input, InputField, InputSlot } from "../../../components/ui";
import { FontAwesome } from "@expo/vector-icons";
import ImageRoute from "../../utils/component/ImageRoute";
import AccountInfo from "../../components/cards/AccountInfo";
import Attributes from "../../components/cards/Attributes";

export default function CompareCards() {
  const [openSearchPage, setOpenSearchPage] = useState(false);
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const { compareItems, isCompareItem, handleCompareToggle } =
    useContext(CompareContext);
  const features = [
    { key: [fieldsType.serviceName], label: "Type" },
    {
      key: [fieldsType.priceAfterDiscount],
      label: "Price",
      format: (v: any) => `EGP ${v}`,
    },
    { key: [fieldsType.city], label: "City" },
    { key: [fieldsType.address], label: "Location" },
    {
      key: [fieldsType.attributes],
      label: "Details",
      Component: (value) => <Attributes attributes={value} />,
    },
    { key: [fieldsType.rate], label: "Rating ⭐" },
    {
      key: [fieldsType.verified],
      label: "Verified",
      format: (v: any) => (v ? "Yes" : "No"),
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        className="bg-body rounded-xl overflow-hidden"
        style={{ flexDirection: isRTL() ? "row-reverse" : "row" }}
      >
        {/* FEATURES COLUMN */}
        <View
          className="w-32 bg-body"
          style={{
            borderRightWidth: !isRTL() ? 1 : 0,
            borderLeftWidth: isRTL() ? 1 : 0,
            borderColor: theme.border,
          }}
        >
          <View className="h-32" />
          {features.map((f) => (
            <View
              key={f.label}
              className="h-16 max-h-28 justify-center px-3 border-t"
              style={{ borderColor: theme.border }}
            >
              <Text
                className="text-xs font-semibold text-text"
                style={{ textAlign: isRTL() ? "right" : "left" }}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ITEMS */}
        {(isRTL() ? [...compareItems].reverse() : compareItems).map(
          (item, index) => (
            <View
              key={index}
              className="w-48 bg-card"
              style={{
                borderLeftWidth: !isRTL() ? 1 : 0,
                borderRightWidth: isRTL() ? 1 : 0,
                borderColor: theme.border,
              }}
            >
              {/* HEADER */}
              <View className="h-32 p-3 items-center justify-center relative">
                <ImageRoute item={item} />
                <Text
                  className="text-xs font-bold text-center mt-2"
                  style={{ color: theme.secondary }}
                >
                  {item[fieldsType.companyName] || "B-Souhool"}
                </Text>

                {/* DELETE BUTTON */}
                <TouchableOpacity
                  onPress={() => handleCompareToggle(item, fieldsType)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: !isRTL() ? 5 : undefined,
                    left: isRTL() ? 5 : undefined,
                    backgroundColor: theme.error,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <FontAwesome name="trash" size={12} color={theme.body} />
                </TouchableOpacity>
              </View>

              {/* VALUES */}
              {features.map((f) => (
                <View
                  key={f.label}
                  className="h-16 max-h-28 justify-center items-center border-t px-2"
                  style={{ borderColor: theme.border }}
                >
                  {!f.Component ? (
                    <Text
                      className={`text-xs font-medium text-center ${
                        f.key === fieldsType.priceAfterDiscount
                          ? "text-error font-bold"
                          : "text-text"
                      }`}
                    >
                      {f.format ? f.format(item[f.key]) : (item[f.key] ?? "-")}
                    </Text>
                  ) : (
                    <>{f.Component(item[f.key])}</>
                  )}
                </View>
              ))}
            </View>
          ),
        )}

        {/* ADD NEW ITEM COLUMN */}
        <View
          className="w-48 bg-body border-dashed"
          style={{
            borderLeftWidth: !isRTL() ? 1 : 0,
            borderRightWidth: isRTL() ? 1 : 0,
            borderColor: theme.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setOpenSearchPage(true)}
            className="h-32 items-center justify-center"
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.surface }}
            >
              <Text className="text-2xl text-text">+</Text>
            </View>

            <Text className="text-xs font-semibold text-text mt-2">
              Add property
            </Text>
          </TouchableOpacity>

          {features.map((f) => (
            <View
              key={f.label}
              className="h-14 border-t"
              style={{ borderColor: theme.border }}
            />
          ))}
        </View>

        {/* SHEET */}
        <Sheet
          isOpen={openSearchPage}
          onClose={() => setOpenSearchPage(false)}
          title="Add property to compare"
        >
          <>
            {/* SEARCH INPUT */}
            <Box className="w-full mb-6">
              <Input
                variant="rounded"
                size="sm"
                className={`w-full h-10 flex-row items-center px-3`}
                style={{
                  flexDirection: isRTL() ? "row-reverse" : "row",
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderWidth: 1,
                }}
              >
                <InputField
                  // value={searchText}
                  // onChangeText={setSearchText}
                  placeholder="Search by name or location"
                  style={{
                    flex: 1,
                    color: theme.text,
                    textAlign: isRTL() ? "right" : "left",
                    fontSize: 14,
                  }}
                />
                <InputSlot
                  className="rounded-full h-6 w-6 flex items-center justify-center"
                  style={{ backgroundColor: theme.primary + "20" }}
                >
                  <FontAwesome name="search" size={16} color={theme.text} />
                </InputSlot>
              </Input>
            </Box>

            {/* LIST */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {initCompanyRows.map((item) => (
                <SheetCard
                  item={item}
                  handleCompareToggle={handleCompareToggle}
                  isCompareItem={isCompareItem}
                />
              ))}
            </ScrollView>
          </>
        </Sheet>
      </View>
    </ScrollView>
  );
}
