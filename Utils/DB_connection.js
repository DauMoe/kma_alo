const mysql = require("mysql");
const path  = require("path");
const util  = require("util");

let ENV_PATH = path.resolve(__dirname, "../../.env");
require("dotenv").config({path: ENV_PATH});

const connection = mysql.createConnection({
    host            : process.env.DB_HOST || 'localhost',
    user            : process.env.DB_USER || 'root',
    password        : process.env.DB_PASS || '',
    database        : process.env.DB_NAME || 'kma_alo'
});

exports.query = util.promisify(connection.query).bind(connection)