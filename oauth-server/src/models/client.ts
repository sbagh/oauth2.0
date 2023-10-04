import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
   name: { type: String, required: true },
   clientId: { type: String, required: true, unique: true },
   clientSecret: { type: String, required: true }, // You'll generate this upon client registration
   redirectUris: [String], // Store multiple URIs if needed
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
