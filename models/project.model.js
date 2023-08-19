import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    title: String,
    image: String,
    description: String,
    githubLink: {
      type: String,
      default: "",
    },
    demoLink: {
      type: String,
      default: "",
    },
    tags: {
      type: Array,
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const projectModel = mongoose.model("project", projectSchema);
