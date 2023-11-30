require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: DB_USER,
    password: '',
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

exports.module = db;
