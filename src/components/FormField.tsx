import { Text, TextInput, StyleSheet, View } from "react-native";
import type { TextInputProps } from "react-native";

// Define the properties our FormField component can receive.
// TextInputProps lets us use regular TextInput properties.
// We also add a label and an optional error message.
type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

// Reusable input component for our application form.
// The remaining TextInput properties are collected in ...props.
const FormField = ({ label, error, ...props }: FormFieldProps) => {
  return (
    <View style={styles.container}>
      {/* Display the field's label above the input. */}
      <Text style={styles.label}>{label}</Text>

      {/* Apply the error style when the field has a validation error. */}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#888"
        {...props}
      />

      {/* Only display an error message if one exists. */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FormField;

// Basic styling shared by all form fields.
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  // Changes the input border to red when validation fails.
  inputError: {
    borderColor: "red",
  },
  // Displays validation messages in red below the input.
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
