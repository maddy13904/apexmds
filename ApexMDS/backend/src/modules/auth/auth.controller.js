import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import Otp from "../../models/Otp.js";
import { sendOtpEmail } from "../../utils/email.js";
import { v4 as uuidv4 } from "uuid";
import LoginHistory from "../../models/LoginHistory.js";


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
  return res.status(400).json({ message: "All fields required" });
}

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
  name,
  email,
  phone,
  role,
  passwordHash
});

    // Create OTP
    const otp = generateOtp();

    await Otp.create({
      userId: user._id,
      otp,
      purpose: "verify_email",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    });

    // (Later we’ll send email here)
    await sendOtpEmail(email, otp, "verify_email");


    res.status(201).json({
      message: "Registration successful. Verify email OTP."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({
      userId: user._id,
      otp,
      purpose: "verify_email",
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    await user.save();

    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getLoginHistory = async (req, res) => {
  try {
    console.log("REQ USER ID:", req.user._id);

    const history = await LoginHistory
      .find({ userId: req.user._id })   // ✅ MUST be _id
      .sort({ loggedInAt: -1 })
      .limit(50);

    console.log("HISTORY FOUND:", history.length);

    return res.json(history);         // ✅ RETURN ARRAY ONLY
  } catch (err) {
    console.error("LOGIN HISTORY ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch login history" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const userAgent = req.headers["user-agent"] || "";

let platform = "unknown";
if (userAgent.includes("Android") || userAgent.includes("iPhone")) {
  platform = "mobile";
} else if (userAgent.includes("iPad") || userAgent.includes("Tablet")) {
  platform = "tablet";
} else {
  platform = "web";
}

    // ✅ CREATE JWT
    const token = jwt.sign(
  {id: user._id},
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
  await LoginHistory.create({
  userId: user._id,
  platform: req.headers["x-platform"] || "web",
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
  status: "success"
});

    user.lastLogin = new Date();
    await user.save();

    // ✅ SEND TOKEN
    return res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  await ActiveSession.deleteOne({
    user: req.user._id,
    sessionId: req.sessionId
  });

  res.json({ message: "Logged out successfully" });
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    await Otp.create({
      userId: user._id,
      otp,
      purpose: "reset_password",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOtpEmail(email, otp, "reset_password");


    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await Otp.findOne({
      userId: user._id,
      otp,
      purpose: "reset_password",
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    res.json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

