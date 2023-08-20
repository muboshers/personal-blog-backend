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

      const token = generateToken(user);

      const { password, device, ...otherField } = user._doc;

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
}