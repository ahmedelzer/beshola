import React from "react";
import { View, Text, Animated as RNAnimated } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import CompanyCardsFlatList from "../../components/company-components/CompanyCardsVirtualized";
import MenuFilter from "../../components/filters/MenuFilter";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";

const MessageItem = ({
  item,
  activeRoom,
  appendMessageToRoom,
  setBotTyping,
  setSelectedItems,
  fieldsType,
  menuItemsState,
  selectedItems,
}) => {
  // MenuFilter
  if (item.type === "component" && item.component === "MenuFilter") {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{ width: "100%", marginBottom: 10 }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: theme.surface,
            borderRadius: 12,
            padding: 6,
          }}
        >
          <MenuFilter
            onFilterDone={(filteredItems = []) => {
              setBotTyping(true);

              setTimeout(() => {
                setBotTyping(false);

                appendMessageToRoom(activeRoom, {
                  id: `${activeRoom}-b-result-${Date.now()}`,
                  text: "Here are the best matches I found:",
                  fromBot: true,
                });

                const first3 = filteredItems.slice
                  ? filteredItems.slice(0, 3)
                  : [];

                appendMessageToRoom(activeRoom, {
                  id: `${activeRoom}-cards-${Date.now()}`,
                  type: "cards",
                  items: [
                    {
                      nodeMenuItemID: "f6d053b4-b873-4cea-b28f-21f369e78a1c",
                      sku: "1233",
                      price: 30.0,
                      rewardPoints: 0.0,
                      discount: 0.0,
                      taxTypeID: "00000000-0000-0000-0000-000000000000",
                      taxAmount: 0,
                      size: 0,
                      preparingTimeAmountPerMinute: 0,
                      isFav: false,
                      isActive: true,
                      isAvailable: true,
                      nodeID: "2421d86a-0043-441b-988a-e7cfad6273a7",
                      node_Name: "MainNode",
                      nodeAddress: "Minia/Default Street/Default Zone/1/1/A ",
                      priceAfterDiscount: 30.0,
                      menuItemID: "5ca158be-2685-4757-8866-0563808e21e1",
                      rate: 5.0,
                      numberOfOrders: 0,
                      numberOfReviews: 0,
                      numberOfLikes: 1,
                      numberOfDislikes: 0,
                      companyItemImage:
                        "MenuItemImages\\MenuItemImages.jpg?v1/1/0001 12:00:00 AM?v1/1/0001 12:00:00 AM",
                      menuCategoryName: "Foods",
                      indexOflike: 1,
                      pricePlans: [
                        {
                          name: "3BR Standard",
                          price: "EGP 2,000,000",
                          area: 150,
                          paymentPlan: "10% downpayment - 6 years installments",
                          deliveryDate: "2026",
                        },
                        {
                          name: "3BR Premium",
                          price: "EGP 2,300,000",
                          area: 165,
                          paymentPlan: "15% downpayment - 7 years installments",
                          deliveryDate: "2027",
                        },
                        {
                          name: "4BR Duplex",
                          price: "EGP 3,000,000",
                          area: 210,
                          paymentPlan: "20% downpayment - 8 years installments",
                          deliveryDate: "2028",
                        },
                      ],
                      menuCategoryID: "b7d65f7f-f87a-4fa6-beaa-d799ba77b9ce",
                      menuItemName: "test123",
                      menuItemDescription: "hghjasfjkhas",
                      canReturn: true,
                      keywords: "ttt,trtrt,test123",
                      weightKg: 0,
                      lengthCm: 0,
                      widthCm: 0,
                      heightCm: 0,
                      packageDegree: 0,
                      volume: 0,
                      rating: 4.5,
                      verified: true,
                      companyName: "Beshola",
                      propertyType: "Apartment",
                      bedrooms: 3,
                      bathrooms: 2,
                      area: 165,
                      location: "New Cairo, Egypt",
                      viewers: 24,
                    },
                  ],
                });

                setSelectedItems(
                  first3.map((it) => it.menuItemID || it.id || Math.random()),
                );
              }, 3000);
            }}
          />
        </View>
      </Animated.View>
    );
  }

  // cards
  if (item.type === "cards") {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{ width: "100%", marginVertical: 8 }}
      >
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 12,
            padding: 8,
            maxHeight: 220,
          }}
        >
          <CompanyCardsFlatList
            rows={item.items || []}
            fieldsType={fieldsType}
            cartState={{ rows: [] }}
            menuItemsState={menuItemsState}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </View>
      </Animated.View>
    );
  }

  // text
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        alignSelf: item.fromBot
          ? isRTL()
            ? "flex-end"
            : "flex-start"
          : isRTL()
            ? "flex-start"
            : "flex-end",
        backgroundColor: item.fromBot ? theme.border : theme.accent,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        marginVertical: 6,
        maxWidth: "75%",
      }}
    >
      <Text
        style={{ color: item.fromBot ? theme.text : theme.body, fontSize: 14 }}
      >
        {item.text}
      </Text>
    </Animated.View>
  );
};

export default MessageItem;
