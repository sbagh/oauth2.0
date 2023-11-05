class OAuthError extends Error {
   constructor(type, message, statusCode, redirectUri, state) {
      super(message);
      this.type = type;
      this.statusCode = statusCode;
      this.redirectUri = redirectUri;
      this.state = state;
   }

   // if authorzation requests is missing required params
   static invalidRequest(redirectUri, state) {
      return new OAuthError(
         "invalid_request",
         "Missing required parameters",
         400,
         redirectUri,
         state
      );
   }

   // if client is not authorized
   static invalidClient(redirectUri, state) {
      return new OAuthError(
         "unauthorized_client",
         "Invalid client or redirect URI",
         400,
         redirectUri,
         state
      );
   }
}

export default OAuthError;
