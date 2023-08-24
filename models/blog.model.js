import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    image: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    description: String,
    blogBody: String,
    voiceUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// some comment
export const blogModel = mongoose.model("blog", blogSchema);
