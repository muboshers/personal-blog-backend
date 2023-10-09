import mongoose from "mongoose";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { storage } from "../config/firebase.js";
import { errorHandle } from "../middleware/errorHandle.js";
import { extractTextToHTML } from "../middleware/parseHTML.js";
import { TextToVoice } from "../middleware/textToVoice.js";
import { blogModel } from "../models/blog.model.js";
import { recentlyBlogModel } from "../models/recently.model.js";

export class BlogService {
  static createBlog = async (req, res) => {
    try {
      const { blogBody, title, tags, description } = req.body;
      const extractedText = extractTextToHTML(blogBody);
      const voiceUrl = await TextToVoice(extractedText);
      const storageRef = ref(storage, `/files/${req.file.originalname}`);
      uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then(
          async (url) => {
            await blogModel.create({
              user_id: req.userId,
              voiceUrl,
              blogBody,
              title,
              tags,
              description,
              image: url,
            });
            return res.status(200).json({ message: "Successfully created" });
          }
        );
      });
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
      const pageQueryOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const totalCount = await blogModel.countDocuments(); // Get the total number of blogs
      const totalPages = Math.ceil(totalCount / pageQueryOptions.limit);

      await blogModel
        .find()
        .skip(pageQueryOptions.page * pageQueryOptions.limit)
        .limit(pageQueryOptions.limit)
        .then(async function (allBlog) {
          const recentlyBlogs = await recentlyBlogModel.findOne({
            user_id: req.userId,
          });

          let recentBlogs;

          if (recentlyBlogModel && req.userRole !== "ADMIN")
            recentBlogs = await blogModel.find({
              _id: { $in: recentlyBlogs.recentlyBlog },
            });

          return res.status(200).json({
            success: true,
            blog: {
              totalPages,
              totalCount,
              data: allBlog,
            },
            recentBlogs,
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static updateBlog = async (req, res) => {
    try {
      const { title, tags, description, blogBody } = req.body;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ messagee: "Invalid id" });
      const extractedText = extractTextToHTML(blogBody);
      const voiceUrl = await TextToVoice(extractedText);
      const blog = await blogModel.findById(id);

      if (req.file) {
        const storageRef = ref(storage, `/files/${req.file.originalname}`);
        uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
          getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then(
            async (url) => {
              const httpsReference = ref(storage, blog._doc.image);

              deleteObject(ref(storage, httpsReference._location.path))
                .then(() => console.log("image is deleted"))
                .catch((err) => console.log(err.message));

              await blogModel.findByIdAndUpdate(req.params.id, {
                $set: {
                  title,
                  tags,
                  description,
                  blogBody,
                  voiceUrl,
                  image: url,
                },
              });
              return res
                .status(200)
                .json({ message: "Blog update successfully" });
            }
          );
        });
      } else {
        await blogModel.findByIdAndUpdate(req.params.id, {
          $set: {
            ...req.body,
            voiceUrl,
          },
        });
        res.status(200).json({ message: "Blog update successfully" });
      }
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

      const { id } = req.params;
      const existRecentlyBlog = await recentlyBlogModel.findOne({
        user_id: req.userId,
      });

      if (!existRecentlyBlog) {
        await recentlyBlogModel.create({
          user_id: user?._id,
          recentlyBlog: [id],
        });
        res.status(200).json({ message: "Success" });
      }

      if (existRecentlyBlog.recentlyBlog.length >= 5) {
        existRecentlyBlog.recentlyBlog.pop(id);
      }

      existRecentlyBlog.recentlyBlog.unshift(id);

      await existRecentlyBlog.save();

      const currentBlog = await blogModel.findById(req.params.id);

      res.status(200).json(currentBlog);
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };
}
