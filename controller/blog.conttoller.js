import { BlogService } from "../services/blog.services.js";

export const CreateBlogPostController = (req, res) =>
  BlogService.createBlog(req, res);

export const DeleteBlogController = (req, res) =>
  BlogService.deleteBlog(req, res);

export const UpdateBlogController = (req, res) =>
  BlogService.updateBlog(req, res);

export const GetBlogController = (req, res) => BlogService.getAllBlog(req, res);
