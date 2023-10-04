import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true }, // Remember to hash this before saving
   email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

export default User;
