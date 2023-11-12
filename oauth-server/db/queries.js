import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "oauth_server_db",
   host: "localhost",
   port: "5432",
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
   scope
) => {
   // set expiration time for the code
   const authCodeDuration = 3000;
   const expiresAt = new Date(Date.now() + authCodeDuration);
   try {
      const queryString = `
            INSERT INTO authorization_codes (code, client_id, redirect_uri, expires_at, scope)
            VALUES ($1, $2, $3, $4, $5)`;
      const queryParams = [code, clientId, redirectUri, expiresAt, scope];
      await pool.query(queryString, queryParams);
   } catch (error) {
      console.log(error);
      throw new Error(
         "Database error during the authorization code save operation"
      );
   }
};
