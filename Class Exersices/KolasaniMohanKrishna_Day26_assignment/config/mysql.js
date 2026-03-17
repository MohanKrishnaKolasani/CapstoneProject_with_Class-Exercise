const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.log("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = connection;