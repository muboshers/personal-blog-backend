import { BlogService } from "../services/blog.services.js";

export const CreateBlogPostController = (req, res) =>
  BlogService.createBlog(req, res);
