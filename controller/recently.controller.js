import { Recently } from "../services/recently.services.js";

export const CreateRecentlyBlogController = (req, res) =>
  Recently.createRecently(req, res, false);

export const GetRecentlyBlogList = (req, res) =>
  Recently.getRecentlyBlogList(req, res);
