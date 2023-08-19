import mongoose from "mongoose";

const recentlyBlogSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    recentlyBlog: {
      type: [mongoose.Types.ObjectId],
      ref: "blog",
    },
  },
  {
    timestamps: true,
  }
);

export const recentlyBlogModel = mongoose.model(
  "recentlyblog",
  recentlyBlogSchema
);
