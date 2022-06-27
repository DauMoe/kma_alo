import { enablePromise, openDatabase } from "react-native-sqlite-storage";
import { DB_FILE_NAME, HOST_TABLE, HOST_TB_CREATE_AT, HOST_TB_ID, HOST_TB_VALUE, TOKEN_TABLE, TOKEN_TB_CREATE_AT, TOKEN_TB_ID, TOKEN_TB_VALUE } from "./Definition";

const OpenDBSuccess = function() {
    console.info("Open DB ok");
}

const OpenDBFail = function() {
    console.error("Open DB fail");
}

const db = openDatabase({name: DB_FILE_NAME, location: "default"}, OpenDBSuccess, OpenDBFail);

(function initDatabase() {
    enablePromise(true);
    const CREATE_TOKEN_DATABASE_SQL = `CREATE TABLE IF NOT EXISTS ${TOKEN_TABLE} (
        ${TOKEN_TB_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${TOKEN_TB_VALUE} LONGTEXT,
        ${TOKEN_TB_CREATE_AT} DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    const CREATE_HOST_DATABASE_SQL = `CREATE TABLE IF NOT EXISTS ${HOST_TABLE} (
        ${HOST_TB_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${HOST_TB_VALUE} LONGTEXT,
        ${HOST_TB_CREATE_AT} DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    db.transaction(function(tx) {
        tx.executeSql(CREATE_HOST_DATABASE_SQL);
        tx.executeSql(CREATE_TOKEN_DATABASE_SQL);
    });
})();

export const CheckLocalHost = function() {
    const SQL = `SELECT * FROM ${HOST_TABLE} ORDER BY ${HOST_TB_CREATE_AT} DESC`;
    return new Promise(function (resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql(SQL, [], function(tx, result) {
                resolve(result);
            }, function(tx, error) {
                reject(error);
            });
        });
    });
}

export const CheckLocalToken = async function() {
    const SQL = `SELECT * FROM ${TOKEN_TABLE} ORDER BY ${TOKEN_TB_CREATE_AT} DESC`;
    return new Promise(function (resolve, reject) {
        db.transaction(function(tx) {
            tx.executeSql(SQL, [], function(tx, result) {
                resolve(result);
            }, function(tx, error) {
                reject(error);
            });
        });
    });
}

export const _db = db;