import { Router } from "express";
import multer from "multer";
import { CreateBlogPostController } from "../controller/blog.conttoller.js";

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

export default BlogRoutes;
