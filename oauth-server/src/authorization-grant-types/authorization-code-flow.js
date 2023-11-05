import { getClient, saveAuthorizationCode } from "../db/queries.js";
import { generateUniqueCode } from "./utils/code-generator.js"; // You need to create this utility

export default class AuthCodeFlow {
   constructor(clientId, redirectUri, scope, state) {
      this.clientId = clientId;
      this.redirectUri = redirectUri;
      this.scope = scope;
      this.state = state;
   }

   // Authorize the client and get the code
   async authorize() {
      // verify if the client exists
      const client = await getClient(this.clientId);
      if (!client || client.redirect_uri !== this.redirectUri) {
         throw new Error("Invalid client or redirect URI");
      }

      // generate authorization code
      const code = generateUniqueCode();

      // Save the authorization code
      await saveAuthorizationCode(
         code,
         this.clientId,
         this.redirectUri,
         this.scope
      );

      return code;
   }
}
