import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },
    /*profileImage: {
  type: String,
  default: ""
},*/

    passwordHash: {
      type: String,
      required: true
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
