import { errorHandle } from "../middleware/errorHandle.js";
import { recentlyBlogModel } from "../models/recently.model.js";
import { userModel } from "../models/user.model.js";
import { blogModel } from "../models/blog.model.js";

export class Recently {
  static createRecently = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findOne({ device: req.userDevice });
      const existRecentlyBlog = await recentlyBlogModel.findOne({
        user_id: user?._id,
      });

      if (!existRecentlyBlog) {
        await recentlyBlogModel.create({
          user_id: user?._id,
          recentlyBlog: [id],
        });

        res.status(200).json({ message: "Success" });
      }

      if (existRecentlyBlog.recentlyBlog.length >= 5) {
        await existRecentlyBlog.updateOne({
          recentlyBlog: { $pop: -1 },
        });
      }
      await existRecentlyBlog.updateOne({
        recentlyBlog: { $push: newItemId },
      });

      return res.status(200).json({ message: "Success!" });
    } catch (err) {
      return errorHandle({ err, res });
    }
  };

  static getRecentlyBlogList = async (req, res) => {
    try {
      const recentlyBlogs = await recentlyBlogModel.findOne({
        user_id: req.userId,
      });

      if (!recentlyBlogModel)
        return res.status(400).json({ message: "Not found!" });

      const getAllBlogs = await blogModel.find({
        _id: { $in: recentlyBlogs.recentlyBlog },
      });

      res.status(200).json({ success: true, data: getAllBlogs });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };
}
