import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { registerUser, verifyEmailOtp } from "../services/auth.service";
import { OTPInput } from "../component/OTPInput";

export function RegisterScreen({ navigation }: any) {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [role, setRole]= useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  const finalOtp = otp.join("");

  if (finalOtp.length === 6) {
    handleOtpComplete();
  }
}, [otp]);

  const isValidPhone = (phone: string) => {
  return /^[0-9]{10}$/.test(phone);
  };

 const passwordChecks = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[@$!%*?&#]/.test(password),
};

const PasswordRule = ({ valid, label }: { valid: boolean; label: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
    <Ionicons
      name={valid ? "checkmark-circle" : "close-circle"}
      size={16}
      color={valid ? "#16A34A" : "#DC2626"}
      style={{ marginRight: 6 }}
    />
    <Text style={{ color: valid ? "#16A34A" : "#DC2626", fontSize: 13 }}>
      {label}
    </Text>
  </View>
);

const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Handle Details Submit
const handleDetailsSubmit = async () => {
  if (!name || !email || !phone || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  if (!isValidPhone(phone)) {
    alert("Phone number must contain exactly 10 digits");
    return;
  }

   if (!isPasswordValid) {
  alert("Please meet all password requirements");
  return;
}

  try {
    setIsLoading(true);

    await registerUser({
      name,
      email,
      phone,
      role,
      password
    });

    // ✅ Backend has generated OTP
    setStep("otp");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Registration failed");
    } else {
      alert("Something went wrong");
    }
  } finally {
    setIsLoading(false);
  }
};

  // Handle OTP Verification
 const handleOtpComplete = async () => {
  const finalOtp = otp.join("");
  if (finalOtp.length !== 6) return;

  try {
    setIsLoading(true);
    await verifyEmailOtp({ email, otp: finalOtp });
    navigation.replace("Login");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
      <View style={styles.content}>

        {/* Title */}
        <Text style={styles.title}>
          {step === "details" ? "Create Account" : "Verify Email"}
        </Text>
        <Text style={styles.subtitle}>
          {step === "details"
            ? "Start your journey to success today"
            : "Enter the 6-digit code sent to your Email"}
        </Text>

        {/* STEP 1 — DETAILS FORM */}
        {step === "details" && (
          <View style={{ marginTop: 20 }}>

            {/* Full Name */}
            <View style={styles.inputBox}>
              <Ionicons name="person" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="grey"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="briefcase" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Role (e.g., Doctor, Student, Intern)"
                placeholderTextColor="grey"
                value={role}
                onChangeText={setRole}
              />
            </View>

            {/* Email */}
            <View style={styles.inputBox}>
              <Ionicons name="mail" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="grey"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputBox}>
              <Ionicons name="call" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="grey"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor="grey"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#64748B"
    />
  </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
  <PasswordRule valid={passwordChecks.length} label="At least 8 characters" />
  <PasswordRule valid={passwordChecks.uppercase} label="One uppercase letter" />
  <PasswordRule valid={passwordChecks.lowercase} label="One lowercase letter" />
  <PasswordRule valid={passwordChecks.number} label="One number" />
  <PasswordRule valid={passwordChecks.special} label="One special character" />
</View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleDetailsSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 — OTP FORM */}
        {step === "otp" && (
          <View style={{ marginTop: 30 }}>

            <OTPInput
  value={otp}
  onChange={setOtp}
/>

            <TouchableOpacity
              style={styles.button}
              onPress={handleOtpComplete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendBox}>
              <Text style={styles.resendText}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Login Link */}
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  content: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A"
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 15
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color:"black"
  },

  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 8
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  otpInput: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 15,
    fontSize: 18,
    letterSpacing: 6,
    textAlign: "center"
  },

  resendBox: {
    marginTop: 20,
    alignItems: "center"
  },

  resendText: {
    fontSize: 13,
    color: "#64748B"
  },

  resendLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0284C7",
    marginTop: 5
  },

  loginBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30
  },

  loginText: {
    fontSize: 14,
    color: "#64748B"
  },

  loginLink: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "bold"
  }
});
