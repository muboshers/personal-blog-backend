import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  const token = jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: "1D",
    algorithm: "HS256",
  });
  return token;
};
