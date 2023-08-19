import mongoose from "mongoose";

const newsLetterSchema = mongoose.Schema(
  {
    email: String,
  },
  {
    timestamps: true,
  }
);

export const newsLetterModel = mongoose.model("newsletter", newsLetterSchema);
