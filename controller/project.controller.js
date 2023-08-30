import { ProjectService } from "../services/project.services.js";

export const CreateProjectController = (req, res) =>
  ProjectService.createProject(req, res);

export const UpdateProjectController = (req, res) =>
  ProjectService.updateProject(req, res);

export const DeleteteProjectController = (req, res) =>
  ProjectService.deleteProject(req, res);

export const GetProjectListController = (req, res) =>
  ProjectService.getAllProject(req, res);

export const GetProjectByIdController = (req, res) =>
  ProjectService.getProjectById(req, res);
