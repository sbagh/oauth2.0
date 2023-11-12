import * as db from "../db/queries.js";
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
      const client = await db.getClient(this.clientId);
      console.log("client: ", client);

      // check if client exists and if the redirect URI matches
      if (!client || client.redirect_uri !== this.redirectUri) {
         throw AuthError.invalidClient(this.redirectUri, this.state);
      }
      // generate authorization code
      const code = generateUniqueCode();

      // Save the authorization code
      await db.saveAuthorizationCode(
         code,
         this.clientId,
         this.redirectUri,
         this.scope
      );
      return code;
   }

   async validateAuthorizationCode(code, client_id, client_secret) {
      // first get the stored authorization data for the client
      const storedAuthroizationData = await db.getAuthzDataFromClientId(
         client_id
      );

      console.log("storedAuthroizationData: ", storedAuthroizationData);

      // check if client secret matches the stored secret
      if (storedAuthroizationData.client_secret !== client_secret) {
         throw AuthError.invalidClient(null, null);
      }

      // check if the code matches the stored code
      if (storedAuthroizationData.code !== code) {
         throw AuthError.invalidGrantType();
      }

      // check if the code is expired
      if (storedAuthroizationData.expires_at < new Date()) {
         throw AuthError.expiredToken();
      }
   }
}
