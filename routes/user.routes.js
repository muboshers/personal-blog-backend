import {Router} from "express";
import {
    GetMeController,
    LoginController,
    RegisterController,
    UpdateController,
} from "../controller/user.controller.js";

const UserRouter = Router();

UserRouter.post("/register", RegisterController);

UserRouter.patch("/update/:id", UpdateController);

UserRouter.post("/login", LoginController);

UserRouter.get("/get-me", GetMeController)

export default UserRouter;
