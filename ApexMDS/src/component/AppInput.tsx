import { TextInput, StyleSheet } from "react-native";
import { COLORS } from "../theme/theme";

export default function AppInput({ placeholder, secureTextEntry, value, onChangeText }: any) {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  }
});
