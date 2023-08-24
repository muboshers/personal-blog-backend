import address from "address";
import { errorHandle } from "./errorHandle.js";
import { userModel } from "../models/user.model.js";

export const registerIpAdress = async (req, res, next) => {
  try {
    address.mac(async function (err, addr) {
      if (err) return errorHandle({ res, err });
      const isExistUser = await userModel.findOne({ device: addr });

      if (!isExistUser) {
        await userModel.create({
          device: addr,
        });
      }
      req.userDevice = addr;
      req.userId = isExistUser?._id;
      next();
    });
  } catch (error) {
    return errorHandle({ res, err: error });
  }
};
