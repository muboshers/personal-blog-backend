import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "Palonchi",
    },
    lastName: {
      type: String,
      default: "Pistonchi",
    },
    email: {
      type: String,
      default: "palonchiemail@com",
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
