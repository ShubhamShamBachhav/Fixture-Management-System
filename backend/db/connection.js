// db/connection.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'shubh2991',
  database: process.env.DB_NAME || 'fixturedb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;
