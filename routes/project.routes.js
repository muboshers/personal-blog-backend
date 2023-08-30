import { Router } from "express";
import {
  CreateProjectController,
  DeleteteProjectController,
  GetProjectByIdController,
  GetProjectListController,
  UpdateProjectController,
} from "../controller/project.controller.js";

const ProjectRouter = Router();

ProjectRouter.get("/list", GetProjectListController);
ProjectRouter.get("/:id", GetProjectByIdController);
ProjectRouter.post("/create", CreateProjectController);
ProjectRouter.delete("/delete/:id", DeleteteProjectController);
ProjectRouter.patch("/update/:id", UpdateProjectController);

export default ProjectRouter;
