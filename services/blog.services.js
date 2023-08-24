import mongoose from "mongoose";
import { errorHandle } from "../middleware/errorHandle.js";
import { extractTextToHTML } from "../middleware/parseHTML.js";
import { TextToVoice } from "../middleware/textToVoice.js";
import { blogModel } from "../models/blog.model.js";
import { recentlyBlogModel } from "../models/recently.model.js";
import fs from "fs";
import { Recently } from "./recently.services.js";

export class BlogService {
  static createBlog = async (req, res) => {
    try {
      const { blogBody, title, tags, description } = req.body;
      const image = req.file.filename;
      const extractedText = extractTextToHTML(blogBody);
      const voiceUrl = await TextToVoice(extractedText);
      await blogModel.create({
        user_id: req.userId,
        voiceUrl,
        blogBody,
        title,
        tags,
        description,
        image,
      });
      res.status(200).json({ message: "Blog created" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static deleteBlog = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ messagee: "Invalid id" });
      await blogModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static getAllBlog = async (req, res) => {
    try {
      const allBlog = await blogModel.find();
      const recentlyBlogs = await recentlyBlogModel.findOne({
        user_id: req.userId,
      });

      let recentBlogs;

      if (recentlyBlogModel && req.userRole !== "ADMIN")
        recentBlogs = await blogModel.find({
          _id: { $in: recentlyBlogs.recentlyBlog },
        });

      return res.status(200).json({ blog: allBlog, recentBlogs });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static updateBlog = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ messagee: "Invalid id" });

      const { blogBody, title, tags, description } = req.body;

      const image = req?.file?.filename;

      let blog = await blogModel.findById(req.params.id);

      if (blogBody !== blog.blogBody) {
        const extractedText = extractTextToHTML(blogBody);
        blog.voiceUrl = await TextToVoice(extractedText);
      }

      if (image) {
        fs.unlinkSync(blogBody.image);
        blogBody.image = image;
      }

      blog.title = title ?? blog.title;
      blog.tags = tags ?? blog.tags;
      blog.description = description ?? blog?.description;
      blog.blogBody = blogBody ?? blog?.blogBody;

      await blog.save();

      res.status(200).json({ message: "blog edited!" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static readBlogById = async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(req.params.id) ||
        !mongoose.Types.ObjectId.isValid(req.userId)
      )
        return res.status(404).json({ messagee: "Invalid id" });
        
      await Recently.createRecently(req, res);

      const currentBlog = await blogModel.findById(req.params.id);

      res.status(200).json(currentBlog);
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };
}
