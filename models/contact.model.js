import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    title: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

export const contactModel = mongoose.model("contact", contactSchema);
