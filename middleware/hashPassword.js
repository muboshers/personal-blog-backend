import bcrypt from "bcryptjs";
import { errorHandle } from "./errorHandle.js";

// some comment

export const hashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    return errorHandle({ err });
  }
};

export const verifyPassword = async (password, bcryptPassword) => {
  try {
    return bcrypt.compare(password, bcryptPassword);
  } catch (err) {
    return errorHandle({ err });
  }
};
