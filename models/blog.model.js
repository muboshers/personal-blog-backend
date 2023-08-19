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
      type: [
        {
          color: String,
          value: String,
        },
      ],
      default: [],
    },
    description: String,
    blogBody: String,
  },
  {
    timestamps: true,
  }
);

export const blogModel = mongoose.model("blog", blogSchema);
