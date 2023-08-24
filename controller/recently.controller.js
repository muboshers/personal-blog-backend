import { Recently } from "../services/recently.services.js";

export const CreateRecentlyBlogController = (req, res) =>
  Recently.createRecently(req, res);

export const GetRecentlyBlogList = (req, res) =>
  Recently.getRecentlyBlogList(req, res);
