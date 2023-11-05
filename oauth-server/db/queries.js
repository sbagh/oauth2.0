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

export const saveAuthorizationCode = async () => {};
