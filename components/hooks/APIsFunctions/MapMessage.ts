export const mapMessage = (
  message: string,
  input: Record<string, any>,
): string => {
  // Regex to match: Field{key}:D{default}
  const pattern = /Field\{([^}]+)\}(?::D\{([^}]+)\})?/g;

  const result = message.replace(
    pattern,
    (_, key: string, defaultValue: string) => {
      const value = input[key];
      return value !== undefined && value !== null
        ? String(value)
        : (defaultValue ?? "");
    },
  );

  return result;
};
