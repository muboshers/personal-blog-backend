import { ContactServices } from "../services/contact.services.js";

export const SendContactMessageController = (req, res) =>
  ContactServices.sendMessage(req, res);

export const GetContactMessagesListController = (req, res) =>
  ContactServices.getListMessages(req, res);

export const ReadContactMessagesListController = (req, res) =>
  ContactServices.readMessage(req, res);

export const SendContactToUserMessagesListController = (req, res) =>
  ContactServices.sendUserMessage(req, res);

export const DeleteContactToUserMessagesListController = (req, res) =>
  ContactServices.deleteContactMessages(req, res);
