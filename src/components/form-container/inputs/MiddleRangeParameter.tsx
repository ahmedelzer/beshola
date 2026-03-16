import React, { useEffect, useMemo, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RangeSlider from "./CustomInputs/RangeSlider";

export default function MiddleRangeParameter({
  fieldName,
  value: initialRange,
}) {
  const { width } = useWindowDimensions();
  const sliderWidth = useMemo(() => (width > 768 ? width * 0.5 : width * 0.9), [width]);

  // 1. BOUNDS STATE: This defines the far left and far right of the slider track
  const [bounds, setBounds] = useState({
    min: initialRange?.min ?? 0,
    max: initialRange?.max ?? 500,
  });

  // 2. SELECTION STATE: This defines where the thumbs are currently sitting
  const [currentRange, setCurrentRange] = useState({
    min: initialRange?.min ?? 0,
    max: initialRange?.max ?? 500,
  });

  const step = useMemo(() => {
    const rangeSize = bounds.max - bounds.min;
    if (rangeSize <= 20) return 1;
    if (rangeSize <= 100) return 5;
    if (rangeSize <= 500) return 10;
    return 50;
  }, [bounds]);

  // 3. RESET LOGIC: When initialRange changes, reset both the track and the thumbs
  useEffect(() => {
    if (initialRange) {
      const newValues = {
        min: initialRange.min,
        max: initialRange.max,
      };
      setBounds(newValues);        // Resets the slider track limits
      setCurrentRange(newValues);  // Resets the thumb positions
    }
  }, [initialRange]);


    return (
  <GestureHandlerRootView>
    <View className="px-4 py-6 w-full">
      <View className="flex-row justify-between mb-3 px-2">
        <Text style={{ fontSize: 14, fontWeight: "500" }}>
          {currentRange.min.toLocaleString()}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>
          {currentRange.max.toLocaleString()}
        </Text>
      </View>

      {/* Logic: If min and max are the same, don't show the slider */}
      {bounds.min === bounds.max ? (
        <View className="h-10 justify-center items-center bg-gray-100 rounded-lg">
          <Text className="text-gray-500 italic">
            Fixed value: {bounds.min.toLocaleString()}
          </Text>
        </View>
      ) : (
        <RangeSlider
          min={bounds.min}
          max={bounds.max}
          step={step}
          sliderWidth={sliderWidth}
          value={currentRange}
          onValueChange={(val) => {
            setCurrentRange(val);
          }}
        />
      )}
    </View>
  </GestureHandlerRootView>
);
}