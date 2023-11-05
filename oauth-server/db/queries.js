import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// connect to db:
const pool = new Pool({
   user: dotenv.DB_USER,
   password: dotenv.DB_PASS,
   database: "oauth_server_db",
   host: "localhost",
   port: dotenv.DB_PORT,
});

// query db for the client assosiacted with client_id
export const getClient = async (clientId) => {
   try {
      const queryString = "SELECT * FROM clients WHERE client_id = $1";
      const queryParams = [clientId];
      const result = await pool.query(queryString, queryParams);

      // if no client found, return null
      if (!result.rows.length) {
         return null;
      }
      // return the client
      return result.rows[0];
   } catch (error) {
      console.log(error);
      throw new Error("Database error");
   }
};

// save authorization code to authorization_codes table
export const saveAuthorizationCode = async (
   code,
   clientId,
   redirectUri,
   userId,
   scope
) => {
   // set expiration time for the code
   const duration = dotenv.AUTHORIZATION_CODE_DURATION;
   const expiresAt = new Date(Date.now() + duration); // Setting code to expire in 30 minutes
   try {
      const queryString = `
            INSERT INTO authorization_codes (code, client_id, redirect_uri, user_id, expires_at, scope)
            VALUES ($1, $2, $3, $4, $5, $6)`;
      const queryParams = [
         code,
         clientId,
         redirectUri,
         userId,
         expiresAt,
         scope,
      ];
      await pool.query(queryString, queryParams);
   } catch (error) {
      console.log(error);
      throw new Error(
         "Database error during the authorization code save operation"
      );
   }
};
