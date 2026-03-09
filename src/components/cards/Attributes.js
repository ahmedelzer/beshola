import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import ExpandableText from "../../utils/component/ExpandableText";
import { getDynamicWidth } from "../../utils/operation/getDynamicWidth";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";



const AttributeItem = ({ fullText }) => {
  const [itemWidth, setItemWidth] = useState(0);
  const calculatedLimit = Math.floor(Math.max(0, itemWidth - 24) / 8);
  const dynamicWidth = getDynamicWidth(fullText, 8.5, 25);

  return (
    <View 
      onLayout={(e) => setItemWidth(e.nativeEvent.layout.width)}
      style={{ flexDirection: 'row' }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: dynamicWidth,
          maxWidth: 240, 
          backgroundColor: addAlpha(theme.accent, 0.3),
          borderWidth: 1,
          borderColor: addAlpha(theme.accent, 0.3),
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          justifyContent: 'center'
        }}
      >
        <ExpandableText 
          text={fullText} 
          initLimit={(calculatedLimit > 0 ? calculatedLimit : 35) - 5} 
          className="text-white text-sm font-medium"
        />
      </TouchableOpacity>
    </View>
  );
};

const Attributes = ({ attributes = [] }) => {
  if (!attributes.length) return null;

  // Set the limit of items to show initially (e.g., 4)
  const initialLimit = 1;
  const displayedAttributes = attributes.slice(0, initialLimit);
  const hasMore = attributes.length > initialLimit;

  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '100%' }}>
      {displayedAttributes.map((attr, index) => {
        const parts = attr.split(":");
        const key = parts[0]?.trim() || "";
        const value = parts.slice(1).join(":").trim();
        const fullText = value ? `${key}: ${value}` : key;

        return <AttributeItem key={index} fullText={fullText} />;
      })}

      {/* Footer "Show More" Button */}
      {hasMore && (
        <TouchableOpacity 
          style={{ 
            marginTop: 4,
            paddingVertical: 4,
            alignSelf: 'flex-start' 
          }}
          onPress={() => {
            /* Logic to show all attributes, e.g., open a modal or expand the list */
            console.log("Show all attributes pressed");
          }}
        >
          <Text 
            style={{ 
              color: theme.accent, 
              fontSize: 14, 
              fontWeight: 'bold',
              textDecorationLine: 'underline' 
            }}
          >
            Show {attributes.length - initialLimit} more attributes...
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Attributes;