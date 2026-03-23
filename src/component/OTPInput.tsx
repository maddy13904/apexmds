import { View, TextInput, StyleSheet } from "react-native";
import { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
}

export function OTPInput({ value, onChange }: OTPInputProps) {
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...value];
    newOtp[index] = text;
    onChange(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {value.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {              // ✅ FIX HERE
            inputs.current[index] = ref;
          }}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
});
