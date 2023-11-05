class AuthError extends Error {
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

   // if authorization req is missing redirect URI
   static missingRedirectUri() {
      return new OAuthError(
         "invalid_request",
         "Missing redirect URI",
         400,
         null,
         null
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

   // Method to handle the error response
   handleAuthErrorResponse(res) {
      // redirect URI is provided in the error:
      if (this.redirectUri) {
         const redirectUrl = `${this.redirectUri}?error=${encodeURIComponent(
            this.type
         )}&error_description=${encodeURIComponent(
            this.message
         )}&state=${encodeURIComponent(this.state || "")}`;
         res.redirect(redirectUrl);
      } else {
         // redirect URI is not provided in the error:
         res.status(this.statusCode).json({
            error: this.type,
            error_description: this.message,
            state: this.state || "",
         });
      }
   }
}

export default OAuthError;
