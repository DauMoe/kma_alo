const mysql = require("mysql2");
const path  = require("path");
const util  = require("util");
require("dotenv").config();

const connection = mysql.createConnection({
    host            : process.env.DB_HOST || 'localhost',
    user            : process.env.DB_USER || 'root',
    password        : process.env.DB_PASS || '',
    database        : process.env.DB_NAME || 'kma_alo'
});

exports.query = util.promisify(connection.query).bind(connection)