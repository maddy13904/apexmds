import bcrypt from "bcrypt";
import User from "../../models/User.js";
import TestSession from "../../models/TestSession.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";
import LoginHistory from "../../models/LoginHistory.js";
import Otp from "../../models/Otp.js";

export const getMyProfile = async (req, res) => {
  console.log("JWT USER:", req.user);

  const user = await User.findById(req.user.id);

  console.log("DB USER:", user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ success: true, user });
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, role },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both passwords are required" });
    }

    // 🔥 Re-fetch user WITH passwordHash
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Current password incorrect" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Password incorrect" });
  }

    const userid = req.user._id;

    // 1️⃣ Delete all test sessions
    await TestSession.deleteMany({ user: userid });

    // 2️⃣ Delete question attempts
    await QuestionAttempt.deleteMany({ user: userid });
    
    await LoginHistory.deleteMany({userId: userid});

    await Otp.deleteMany({userId: userid});


    // 4️⃣ Finally delete user
    await User.findByIdAndDelete(userid);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: error.message });
  }
};
