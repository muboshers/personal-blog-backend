import { Router } from "express";
import {
  CreateRecentlyBlogController,
  GetRecentlyBlogList,
} from "../controller/recently.controller.js";

const RecentlyBlogRoutes = Router();

RecentlyBlogRoutes.post("/create-recently", CreateRecentlyBlogController);

RecentlyBlogRoutes.get("/get-blog-list", GetRecentlyBlogList);

export default RecentlyBlogRoutes;
