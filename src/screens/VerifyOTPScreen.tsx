import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import {
  verifyEmailOtp,
  verifyResetOtp
} from "../services/auth.service";
import { OTPInput } from "../component/OTPInput";



export function VerifyOTPScreen({ route, navigation }: any) {
  const { email, purpose } = route.params;
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
  const finalOtp = otp.join("");

  if (finalOtp.length === 6) {
    handleVerify();
  }
}, [otp]);


 const handleVerify = async () => {
  const finalOtp = otp.join("");

  if (finalOtp.length !== 6) {
    alert("Please enter a valid 6-digit OTP");
    return;
  }

  try {
    setIsLoading(true);

    if (purpose === "reset") {
      await verifyResetOtp({ email, otp: finalOtp });
      navigation.replace("ResetPassword", { email });
    } else {
      await verifyEmailOtp({ email, otp: finalOtp });
      alert("Registration Successfull! Login to Continue...");
      navigation.replace("Login");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "OTP verification failed");
    } else {
      alert("Something went wrong");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#475569" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email.
        </Text>

        {/* OTP Input */}
        <OTPInput
  value={otp}
  onChange={setOtp}
/>

        {/* Verify Button */}
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
  {isLoading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text style={styles.buttonText}>Verify OTP</Text>
  )}
</TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendBox}>
          <Text style={styles.resendText}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20
  },

  backButton: {
    padding: 6,
    alignSelf: "flex-start",
    marginBottom: 20
  },

  content: {
    flex: 1,
    justifyContent: "center"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 30
  },

  otpInput: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: "center",
    marginBottom: 20
  },

  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 6
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  resendBox: {
    marginTop: 30,
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
    marginTop: 6
  }
});
