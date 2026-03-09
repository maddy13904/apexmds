import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/theme";

export default function AppButton({ title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600"
  }
});
