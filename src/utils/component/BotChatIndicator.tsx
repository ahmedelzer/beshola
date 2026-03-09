// BotChat.js
import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import { isRTL } from "../operation/isRTL";
import { theme } from "../../Theme";
import RedCounter from "./RedCounter";
import MenuFilter from "../../components/filters/MenuFilter";
import CompanyCardsFlatList from "../../components/company-components/CompanyCardsVirtualized";

import { useCart } from "../../../context/CartProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import { useMenu } from "../../../context/SearchProvider";
import { useSelector } from "react-redux";

const BotChat = () => {
  const [open, setOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

  // messages per room; initial Sales includes MenuFilter component message
  const [messages, setMessages] = useState({
    support: [{ id: "s1", text: "Hello! How can I help?", fromBot: true }],
    sales: [
      { id: "sa1", text: "Welcome! Looking for our prices?", fromBot: true },
      { id: "sa2", type: "component", component: "MenuFilter" },
    ],
    tech: [{ id: "t1", text: "Technical support online!", fromBot: true }],
  });

  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  // For cards rendering (selected items state forwarded to CompanyCardsFlatList)
  const [selectedItems, setSelectedItems] = useState([]);

  const flatRef = useRef(null);

  // external data for CompanyCardsFlatList
  const { menuItemsState } = useSchemas();
  const fieldsType = useSelector((s) => s.menuItem?.fieldsType);

  // append message helper
  const appendMessageToRoom = (roomId, msg) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId] ? [...prev[roomId], msg] : [msg],
    }));
  };

  // auto-scroll to bottom on messages change for active room
  useEffect(() => {
    const t = setTimeout(() => {
      if (flatRef.current) {
        try {
          // scrollToEnd available on RN FlatList through ref -> scrollToEnd
          flatRef.current.scrollToEnd({ animated: true });
        } catch (e) {
          // fallback: scroll to last index
        }
      }
    }, 120);
    return () => clearTimeout(t);
  }, [messages, activeRoom, open]);

  // send user message
  const sendMessage = () => {
    if (!input.trim() || !activeRoom) return;

    const userMsg = {
      id: `${activeRoom}-u-${Date.now()}`,
      text: input,
      fromBot: false,
    };
    appendMessageToRoom(activeRoom, userMsg);
    setInput("");

    // example bot reply (simulate)
    setTimeout(() => {
      appendMessageToRoom(activeRoom, {
        id: `${activeRoom}-b-${Date.now()}`,
        text: "Here’s something based on your request!",
        fromBot: true,
      });

      if (activeRoom === "sales") {
        appendMessageToRoom(activeRoom, {
          id: `sa-filter-${Date.now()}`,
          type: "component",
          component: "MenuFilter",
        });
      }
    }, 800);
  };

  // open room
  const openRoom = (roomId) => {
    setActiveRoom(roomId);
    setOpen(true);
  };

  // render a single message item
  const renderItem = ({ item }) => {
    // MenuFilter component insertion
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
              shadowColor: theme.overlay,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <MenuFilter
              // MenuFilter should call props.onFilterDone(filteredItems)
              onFilterDone={(filteredItems = []) => {
                // show typing indicator
                setBotTyping(true);

                // after 3 seconds: turn off typing, bot posts a reply and then the cards (first 3)
                setTimeout(() => {
                  setBotTyping(false);

                  // Bot text reply
                  appendMessageToRoom(activeRoom, {
                    id: `${activeRoom}-b-result-${Date.now()}`,
                    text: "Here are the best matches I found:",
                    fromBot: true,
                  });

                  // prepare up to first 3 items
                  const first3 = filteredItems.slice
                    ? filteredItems.slice(0, 3)
                    : [];

                  // push cards message into chat
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
                            paymentPlan:
                              "10% downpayment - 6 years installments",
                            deliveryDate: "2026",
                          },
                          {
                            name: "3BR Premium",
                            price: "EGP 2,300,000",
                            area: 165,
                            paymentPlan:
                              "15% downpayment - 7 years installments",
                            deliveryDate: "2027",
                          },
                          {
                            name: "4BR Duplex",
                            price: "EGP 3,000,000",
                            area: 210,
                            paymentPlan:
                              "20% downpayment - 8 years installments",
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

                  // (optional) update local selectedItems state for CompanyCardsFlatList interaction
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

    // cards message: render CompanyCardsFlatList inside chat
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
              // limit height so it behaves as a bubble and doesn't break layout
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

    // normal text bubble
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
          style={{
            color: item.fromBot ? theme.text : theme.body,
            fontSize: 14,
          }}
        >
          {item.text}
        </Text>
      </Animated.View>
    );
  };

  // sample rooms list (static)
  const roomsList = [
    { id: "support", name: "Support", icon: "help-circle" },
    { id: "sales", name: "Sales", icon: "pricetag" },
    { id: "tech", name: "Technical", icon: "construct" },
  ];

  return (
    <>
      {/* Chat Popup */}
      {open && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutDown}
          style={{
            position: "absolute",
            bottom: 120,
            right: !isRTL() ? 20 : undefined,
            left: isRTL() ? 20 : undefined,
            width: 320,
            height: 480,
            borderRadius: 16,
            backgroundColor: theme.card,
            overflow: "hidden",
            zIndex: 999,
            shadowColor: theme.overlay,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          {/* Header */}
          <View
            style={{
              padding: 12,
              backgroundColor: theme.accent,
              flexDirection: isRTL() ? "row-reverse" : "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: theme.body, fontSize: 16, fontWeight: "600" }}
            >
              {activeRoom
                ? roomsList.find((r) => r.id === activeRoom)?.name
                : "Chat Rooms"}
            </Text>

            <Pressable
              onPress={() => {
                if (activeRoom) setActiveRoom(null);
                else setOpen(false);
              }}
            >
              <Ionicons name="close" size={22} color={theme.body} />
            </Pressable>
          </View>

          {/* Room list view */}
          {!activeRoom && (
            <View style={{ flex: 1, padding: 12 }}>
              {roomsList.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => openRoom(r.id)}
                  style={{
                    flexDirection: isRTL() ? "row-reverse" : "row",
                    alignItems: "center",
                    padding: 12,
                    backgroundColor: theme.border,
                    borderRadius: 12,
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name={r.icon}
                    size={22}
                    color={theme.text}
                    style={{
                      marginRight: isRTL() ? 0 : 10,
                      marginLeft: isRTL() ? 10 : 0,
                    }}
                  />
                  <Text style={{ color: theme.text, fontSize: 15 }}>
                    {r.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Chat view (active room) */}
          {activeRoom && (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <FlatList
                ref={flatRef}
                data={messages[activeRoom]}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
                renderItem={renderItem}
                // small optimization
                removeClippedSubviews={true}
              />

              {/* show typing indicator right under the messages */}
              {botTyping && (
                <View style={{ paddingHorizontal: 12, marginBottom: 6 }}>
                  <Text style={{ color: theme.text, fontStyle: "italic" }}>
                    Bot is typing…
                  </Text>
                </View>
              )}

              {/* Input */}
              <View
                style={{
                  flexDirection: isRTL() ? "row-reverse" : "row",
                  padding: 8,
                  borderTopWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message…"
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    height: 40,
                    color: theme.text,
                  }}
                />
                <Pressable
                  onPress={sendMessage}
                  style={{
                    marginLeft: isRTL() ? 0 : 8,
                    marginRight: isRTL() ? 8 : 0,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="send" size={24} color={theme.accent} />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          )}
        </Animated.View>
      )}

      {/* Floating Button */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: "absolute",
          bottom: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme.accent,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: theme.overlay,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
          zIndex: 999,
          right: !isRTL() ? 20 : undefined,
          left: isRTL() ? 20 : undefined,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color={theme.body} />
        <RedCounter count={3} />
      </Pressable>
    </>
  );
};

export default BotChat;
