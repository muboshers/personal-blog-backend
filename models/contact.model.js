import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    title: String,
    message: String,
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const contactModel = mongoose.model("contact", contactSchema);
