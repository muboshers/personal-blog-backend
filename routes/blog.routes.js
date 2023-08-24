import { Router } from "express";
import multer from "multer";
import {
  CreateBlogPostController,
  DeleteBlogController,
  GetBlogController,
  UpdateBlogController,
} from "../controller/blog.conttoller.js";

const BlogRoutes = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

BlogRoutes.post("/create", upload.single("image"), CreateBlogPostController);
BlogRoutes.patch("/update/:id", upload.single("image"), UpdateBlogController);

BlogRoutes.delete("/delete/:id", DeleteBlogController);
BlogRoutes.delete("/list", GetBlogController);

export default BlogRoutes;
