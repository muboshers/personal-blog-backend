import mongoose from "mongoose";
import { errorHandle } from "../middleware/errorHandle.js";
import { hashedPassword, verifyPassword } from "../middleware/hashPassword.js";
import { userModel } from "../models/user.model.js";
import { generateToken } from "../middleware/generateToken.js";

export class UserService {
  static userModel = userModel;

  static createUser = async (req, res) => {
    try {
      if (!req.userDevice) throw new Error("Device not found");
      const { firstName, lastName, email } = req.body;
      let isExistUser = await userModel.findOne({ device: req.userDevice });
      let password = await hashedPassword(req.body.password);

      if (isExistUser.firstName)
        return res.status(403).json({ message: "Alrady have accaunt!" });
      if (isExistUser) {
        isExistUser.firstName = firstName;
        isExistUser.lastName = lastName;
        isExistUser.password = password;
        isExistUser.email = email;
        await isExistUser.save();
        return res.status(200).json({ message: "Successfully created " });
      }

      await userModel.create({
        firstName,
        lastName,
        password,
        email,
        device: req.userDevice,
      });
      return res.status(200).json({ message: "Successfully created " });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static updateUser = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        throw new Error("Invalid id");
      const isExistUser = await userModel.findById(req.params.id);

      const { firstName, lastName, email, password } = req.body;
      isExistUser.firstName = firstName || isExistUser?.firstName;
      isExistUser.lastName = lastName || isExistUser?.lastName;
      isExistUser.password = password || isExistUser?.password;
      isExistUser.email = email || isExistUser?.email;
      await isExistUser.save();
      return res.status(200).json({ message: "User update succesfully" });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static loginUser = async (req, res) => {
    try {
      const { email } = req.body;

      let user = await userModel.findOne({ email });

      if (!user) return res.status(404).json({ message: "User not found" });

      const isValidPassword = await verifyPassword(
        req.body.password,
        user?.password
      );

      if (!isValidPassword)
        res.status(401).json({ message: "Invalid password" });

      if (user.device !== req.deviceId) user.device = req.deviceId;

      const token = generateToken(user);

      const { password, device, ...otherField } = user._doc;

      await user.save();

      res.status(200).json({
        user: {
          ...otherField,
        },
        token,
      });
    } catch (error) {
      return errorHandle({ err: error, res });
    }
  };

  static getMeInformation = async (req, res) => {
    try {
      const currentUser = await userModel.findOne({ device: req.userDevice });
      const token = generateToken(currentUser);
      const { password, device, ...otherField } = currentUser?._doc;
      res.status(200).json({
        user: {
          ...otherField,
        },
        token,
      });
    } catch (e) {
      return errorHandle({ err: e, req });
    }
  };

  static getUserList = async (req, res) => {
    try {
      if (!req.userRole || req.userRole !== "ADMIN") {
        return res.status(401).json({ message: "Un authenticated" });
      }
      const page = req.query.page || 1;

      const limit = req.query.limit || 10;

      const searchQuery = req.query.search || "";

      const skip = (page - 1) * limit;

      const query = userModel.find();

      if (searchQuery) {
        query.find({ $text: { $search: searchQuery } });
      }

      const users = await query.skip(skip).limit(limit);

      res.status(200).json(users);

    } catch (error) {
      return errorHandle({ err: error, req });
    }
  };
}
