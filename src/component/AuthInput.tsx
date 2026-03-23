import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap; 
}

export function AuthInput({ label, icon, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color="#94A3B8"
            style={styles.icon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            icon ? { paddingLeft: 42 } : { paddingLeft: 14 }
          ]}
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 4,
    marginBottom: 6
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center"
  },
  icon: {
    position: "absolute",
    left: 14,
    zIndex: 10
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 12,
    paddingRight: 14,
    fontSize: 14,
    color: "#0F172A"
  }
});
