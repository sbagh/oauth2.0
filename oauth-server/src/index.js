import express from "express";
import AuthCodeFlow from "./authorization-grant-types/authorization-code-flow.js";

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
      if (!response_type || !client_id || !redirect_uri || !scope || !state) {
         return res.status(400).json({ error: "invalid request" });
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
         // Redirect the user to the redirect_uri with the authorization code
         return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
      }
   } catch (error) {
      console.log(error);
      throw new Error("Server error");
   }
});

app.get("/token", (req, res) => {});

app.listen(PORT, () => {
   console.log(`Server running on port `, PORT);
});
