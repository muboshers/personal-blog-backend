import { Router } from "express";
import {
  GetMeController,
  GetUserListController,
  LoginController,
  RegisterController,
  UpdateController,
} from "../controller/user.controller.js";

const UserRouter = Router();

UserRouter.post("/register", RegisterController);

UserRouter.patch("/update/:id", UpdateController);

UserRouter.post("/login", LoginController);

UserRouter.get("/get-me", GetMeController);
UserRouter.get("/list", GetUserListController);

export default UserRouter;
