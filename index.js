// config modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
// import { WebSocketServer } from "ws";
// import { createServer } from "http";
import { errorHandle } from "./middleware/errorHandle.js";
import { registerIpAdress } from "./middleware/getIpAdress.js";

//  import routes
import UserRouter from "./routes/user.routes.js";
import RecentlyBlogRoutes from "./routes/recently.routes.js";
import BlogRoutes from "./routes/blog.routes.js";
import ProjectRouter from "./routes/project.routes.js";

// global config
dotenv.config();

const app = express();

app.use(cors({ methods: ["*"], origin: ["http://localhost:3000"] }));
app.use(express.json());
app.use(registerIpAdress);
app.use(express.static("public"));

// app use routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/recently-blog", RecentlyBlogRoutes);
app.use("/api/v1/blog", BlogRoutes);
app.use("/api/v1/project", ProjectRouter);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Developing this app", device: req.userDevice });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT} port`);
    });
  })
  .catch((err) => errorHandle({ err: err }));
