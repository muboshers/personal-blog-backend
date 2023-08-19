// config modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import address from "address";

// global config
dotenv.config();

// register app
const app = express();

// modules config
app.use(cors({ methods: ["*"], origin: ["*"] }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Developing this app" });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on ${PORT} port`));
  })
  .catch((err) => console.log(`Something went wrong: ${err.message}`));
