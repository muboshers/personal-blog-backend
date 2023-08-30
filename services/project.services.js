import mongoose from "mongoose";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { storage } from "../config/firebase.js";
import { errorHandle } from "../middleware/errorHandle.js";
import { extractTextToHTML } from "../middleware/parseHTML.js";
import { TextToVoice } from "../middleware/textToVoice.js";
import { projectModel } from "../models/project.model.js";

export class ProjectService {
  static createProject = async (req, res) => {
    try {
      const { title, tags, description, githubLink, demoLink } = req.body;
      const storageRef = ref(storage, `/files/${req.file.originalname}`);
      uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
        getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then(
          async (url) => {
            await projectModel.create({
              user_id: req.userId,
              title,
              tags,
              description,
              image: url,
              githubLink,
              demoLink,
            });
            return res
              .status(200)
              .json({ message: "Project succesfully created" });
          }
        );
      });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static deleteProject = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ messagee: "Invalid id" });
      await projectModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  /**
   *
   * @param {query.page} req
   * @param {query.limit} req
   * @returns
   */

  static getAllProject = async (req, res) => {
    try {
      const pageQueryOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const totalCount = await blogModel.countDocuments(); // Get the total number of blogs
      const totalPages = Math.ceil(totalCount / pageQueryOptions.limit);

      await projectModel
        .find()
        .skip(pageQueryOptions.page * pageQueryOptions.limit)
        .limit(pageQueryOptions.limit)
        .then(function (allProject) {
          res.status(200).json({
            success: true,
            data: {
              totalCount,
              totalPages,
              data: allProject,
            },
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static updateProject = async (req, res) => {
    try {
      const { title, tags, description, githubLink, demoLink } = req.body;

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ messagee: "Invalid id" });
      const project = await projectModel.findById(id);

      if (req.file) {
        const storageRef = ref(storage, `/files/${req.file.originalname}`);
        uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
          getDownloadURL(ref(storage, snapshot.metadata.fullPath)).then(
            async (url) => {
              const httpsReference = ref(storage, project._doc.image);

              deleteObject(ref(storage, httpsReference._location.path))
                .then(() => console.log("image is deleted"))
                .catch((err) => console.log(err.message));

              await projectModel.findByIdAndUpdate(req.params.id, {
                $set: {
                  user_id: req.userId,
                  title,
                  tags,
                  description,
                  image: url,
                  githubLink,
                  demoLink,
                },
              });
              return res
                .status(200)
                .json({ message: "Project update successfully" });
            }
          );
        });
      } else {
        await projectModel.findByIdAndUpdate(req.params.id, {
          $set: {
            ...req.body,
          },
        });
        res.status(200).json({ message: "Project update successfully" });
      }
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static getProjectById = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ messagee: "Invalid id" });

      const currentProject = await projectModel.findById(req.params.id);

      res.status(200).json(currentProject);
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };
}
