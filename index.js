// config modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandle } from "./middleware/errorHandle.js";
import { registerIpAdress } from "./middleware/getIpAdress.js";

//  import routes
import UserRouter from "./routes/user.routes.js";
import RecentlyBlogRoutes from "./routes/recently.routes.js";

// global config
dotenv.config();

// register app
const app = express();

// modules config
app.use(cors({ methods: ["*"], origin: ["*"] }));
app.use(express.json());
app.use(registerIpAdress);

// app use routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/recently-blog", RecentlyBlogRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Developing this app", device: req.userDevice });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
  })
  .catch((err) => errorHandle({ err: err }));
