import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { InputField, Input } from "../../../../components/ui";

export default function FieldGroup({
  defaultValue,
  name,
  title,
  className,
  control,
  ...props
}) {
  const isTextarea = props.type === "textarea";

  return (
    <Controller
      control={control}
      rules={{
        required: true,
      }}
      name={name}
      render={({ field: { onChange, onBlur, value = defaultValue } }) =>
        isTextarea ? (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            defaultValue={defaultValue}
            placeholder={props.placeholder}
            multiline
            numberOfLines={5}
            // keyboardType={props.type==='number'?"numeric":}
            textAlignVertical="top"
            style={[styles.textarea, props.style]}
          />
        ) : (
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={props.invalidInput}
            isReadOnly={false}
          >
            <InputField
              className="w-full !h-12"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              defaultValue={defaultValue}
              keyboardType={props.type === "number" ? "numeric" : "default"}
              placeholder={props.placeholder}
              style={props.style}
            />
          </Input>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
});
