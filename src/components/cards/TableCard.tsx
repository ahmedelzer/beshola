import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { theme } from "../../Theme";

export default function TableCard({ schema = {}, item, setRow }) {
  return (
    <TouchableOpacity
      className="p-2 rounded-xl mb-2 flex-row gap-1 w-fit"
      style={{ backgroundColor: theme.accent }}
      onPress={() => setRow(item)}
    >
      <Text className="!text-xs font-semibold text-body">
        {
          item?.[
            schema?.dashboardFormSchemaParameters.find(
              (param) =>
                (param.parameterType === "displayText" ||
                  param.parameterType === "text") &&
                !param.isIDField,
            )?.parameterField || "text"
          ]
        }
      </Text>
    </TouchableOpacity>
  );
}
