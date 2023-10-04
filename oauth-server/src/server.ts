import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user";
import Client from "./models/client";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI!);
mongoose.connection.on("connected", () => {
   console.log("Connected to MongoDB");
});

app.post("/register", async (req, res) => {
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
   const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
   });
   try {
      await user.save();
      res.status(201).send("User registered");
   } catch (error) {
      res.status(500).send("Error registering user");
   }
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
