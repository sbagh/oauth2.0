import { getClient, saveAuthorizationCode } from "../db/queries.js";
import { generateUniqueCode } from "../utils/code-generator.js";
import AuthError from "../errors/AuthError.js";

export default class AuthCodeFlow {
   constructor(code, clientId, redirectUri, scope, state) {
      this.code = code;
      this.clientId = clientId;
      this.redirectUri = redirectUri;
      this.scope = scope;
      this.state = state;
   }

   // Authorize the client and get the code
   async authorize() {
      // verify if the client exists
      const client = await getClient(this.clientId);
      console.log("client: ", client);

      // check if client exists and if the redirect URI matches
      if (!client || client.redirect_uri !== this.redirectUri) {
         throw AuthError.invalidClient(this.redirectUri, this.state);
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
