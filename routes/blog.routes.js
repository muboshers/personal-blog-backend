import { Router } from "express";
import multer from "multer";
import {
  CreateBlogPostController,
  DeleteBlogController,
  GetBlogController,
  ReadBlogById,
  UpdateBlogController,
} from "../controller/blog.conttoller.js";
import { upload } from "../config/firebase.js";

const BlogRoutes = Router();

BlogRoutes.post("/create", upload.single("image"), CreateBlogPostController);
BlogRoutes.patch("/update/:id", upload.single("image"), UpdateBlogController);

BlogRoutes.delete("/delete/:id", DeleteBlogController);
BlogRoutes.get("/list", GetBlogController);
BlogRoutes.get("/:id", ReadBlogById);

export default BlogRoutes;
