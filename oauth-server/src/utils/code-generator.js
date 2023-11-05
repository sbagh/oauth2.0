import { randomBytes } from "crypto";

export function generateUniqueCode() {
   // generate 32 bytes random data (256 bits)
   // For a URL-safe string, use 'base64url' encoding
   return randomBytes(32).toString("base64url");
}
