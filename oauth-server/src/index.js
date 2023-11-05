import express from "express";
import AuthCodeFlow from "./authorization-grant-types/authorization-code-flow.js";
import OAuthError from "./errors/OAuthError.js";

const app = express();
app.use(express.json());

const PORT = 3005;

// authorize endpoint, the client calls this endpoint to get the authorization code
app.get("/authorize", async (req, res) => {
   try {
      // get the query params from the request
      const { response_type, client_id, redirect_uri, scope, state } =
         req.query;

      // chekc for all required params
      if (!response_type || !client_id || !redirect_uri) {
         throw OAuthError.invalidRequest(redirect_uri, state);
      }

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

         // Authorization response - redirect the user to the redirect_uri with the code and state
         const successfulRedirectUri = `${redirect_uri}?code=${encodeURIComponent(
            code
         )}&state=${encodeURIComponent(state)}`;
         return res.redirect(successfulRedirectUri);
      }
   } catch (error) {
      // if error is instance of OAuthError, redirect the user to the redirect_uri with the error and state
      if (error instanceof OAuthError && error.redirectUri) {
         return res.redirect(
            `${error.redirectUri}?error=${encodeURIComponent(
               error.message
            )}&state=${encodeURIComponent(error.state || "")}`
         );
      }
      // else, return a server error
      else {
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
