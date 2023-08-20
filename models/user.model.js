import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "USER",
    },
    password: String,
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("users", userSchema);