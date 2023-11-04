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
