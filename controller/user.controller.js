import { UserService } from "../services/user.services.js";

export const RegisterController = (req, res) =>
  UserService.createUser(req, res);

export const UpdateController = (req, res) => UserService.updateUser(req, res);

export const LoginController = (req, res) => UserService.loginUser(req, res);

export const GetMeController = (req, res) =>
  UserService.getMeInformation(req, res);

export const GetUserListController = (req, res) =>
  UserService.getUserList(req, res);
