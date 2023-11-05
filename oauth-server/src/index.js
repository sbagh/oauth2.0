import express from "express";
import AuthCodeFlow from "./authorization-grant-types/authorization-code-flow.js";
import AuthError from "./errors/AuthError.js";

const app = express();
app.use(express.json());

const PORT = 3005;

// authorize endpoint, the client calls this endpoint to get the authorization code
app.get("/authorize", async (req, res) => {
   try {
      // get the query params from the request
      const { response_type, client_id, redirect_uri, scope, state } =
         req.query;

      // check for required params
      if (!redirect_uri) {
         throw OAuthError.missingRedirectUri();
      }
      if (!response_type || !client_id || !redirect_uri) {
         throw OAuthError.invalidRequest(redirect_uri, state);
      }

      // authorization code grant type:
      if (response_type === "code") {
         // create a new authorization code flow
         const authCodeFlow = new AuthCodeFlow(
            client_id,
            redirect_uri,
            scope,
            state
         );

         // Authorize the client and get the code
         const code = await authCodeFlow.authorize();

         // build the authorization response with the auth code and state
         const successfulRedirectUri = `${redirect_uri}?code=${encodeURIComponent(
            code
         )}&state=${encodeURIComponent(state)}`;

         // redirect user with the authorization code
         return res.redirect(successfulRedirectUri);
      }
   } catch (error) {
      // if error is instance of AuthError class, handle the response else return a server error
      if (error instanceof AuthError) {
         error.handleAuthErrorResponse(res);
      } else {
         //
         console.error(error);
         res.status(500).json({
            error: "server_error",
            error_description: "An unexpected error occurred",
         });
      }
   }
});

app.get("/token", (req, res) => {});

app.listen(PORT, () => {
   console.log(`Server running on port `, PORT);
});
