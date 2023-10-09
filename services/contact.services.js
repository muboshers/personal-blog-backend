import mongoose from "mongoose";
import { errorHandle } from "../middleware/errorHandle";
import { contactModel } from "../models/contact.model";
import { sendContactMessageEmail } from "../config/email";

export class ContactServices {
  static sendMessage = async (req, res) => {
    try {
      if (req?.userRole !== "USER")
        return res.status(400).json({ message: "Invalid role" });

      await contactModel.create({
        ...req.body,
      });
      res.status(200).json({ message: "Your message recived" });
    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };

  static readMessage = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ message: "Invalid id" });

      if (req?.userRole !== "ADMIN")
        return res.status(400).json({ message: "Invalid role" });

      await contactModel.findByIdAndUpdate(id, {
        $set: {
          is_read: true,
        },
      });
      res.status(200).json({ message: "Message status update" });
    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };

  static sendUserMessage = async (req, res) => {
    try {
      const { id } = req.params;

      if (req?.userRole !== "ADMIN")
        return res.status(400).json({ message: "Invalid role" });

      const { title, email, message } = req.body;

      await contactModel.findByIdAndUpdate(id, {
        $set: {
          is_answered: true,
        },
      });

      sendContactMessageEmail(email, title, message);
      res.status(200).json({ message: "Message status update" });
    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };

  static getListMessages = async (req, res) => {
    try {
      if (req?.userRole !== "ADMIN")
        return res.status(400).json({ message: "Invalid role" });
      const page = req.query.page || 1;

      const limit = req.query.limit || 10;

      const searchQuery = req.query.search || "";

      const skip = (page - 1) * limit;

      const query = contactModel.find();

      if (searchQuery) {
        query.find({ $text: { $search: searchQuery } });
      }

      const users = await query.skip(skip).limit(limit);

      res.status(200).json(users);
    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };

  static deleteContactMessages = async (req, res) => {
    try {
      if (req?.userRole !== "ADMIN")
        return res.status(400).json({ message: "Invalid role" });

      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ message: "Invalid id" });

      await contactModel.findByAndDelete(id);
      res.status(200).json({ message: "Contact message deleted" });
    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };
}
