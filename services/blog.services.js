import { errorHandle } from "../middleware/errorHandle.js";
import { extractTextToHTML } from "../middleware/parseHTML.js";
import { TextToVoice } from "../middleware/textToVoice.js";
import { blogModel } from "../models/blog.model.js";

export class BlogService {
  static createBlog = async (req, res) => {
    try {
      const { blogBody, title, tags, description } = req.body;
      const image = req.file.filename;
      const extractedText = extractTextToHTML(blogBody);
      const voiceUrl = await TextToVoice(extractedText);
      await blogModel.create({
        user_id: req.userId,
        voiceUrl,
        blogBody,
        title,
        tags,
        description,
        image,
      });
      res.status(200).json({ message: "Blog created" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };
}
