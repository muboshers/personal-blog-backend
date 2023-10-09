import { Router } from "express";
import {
  DeleteContactToUserMessagesListController,
  GetContactMessagesListController,
  ReadContactMessagesListController,
  SendContactMessageController,
  SendContactToUserMessagesListController,
} from "../controller/contact.controller";

const ContactRoutes = Router();
ContactRoutes.get("/list", GetContactMessagesListController);
ContactRoutes.post("/send-message", SendContactMessageController);
ContactRoutes.patch("/read/:id", ReadContactMessagesListController);
ContactRoutes.delete("/delete/:id", DeleteContactToUserMessagesListController);
ContactRoutes.post("/send-to-user", SendContactToUserMessagesListController);
export default ContactRoutes;
