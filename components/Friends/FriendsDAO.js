const mysql = require("mysql");
const {query} = require("../../Utils/DB_connection");
const {DB_RESP, DB_ERR} = require("../../Utils/UtilsFunction");

const FILE_NAME = " - FriendsDAO.js";

exports.RecommendNewFriendsDAO = async(uid, list_mobile, list_email) => {
    const FUNC_NAME = `RecommendNewFriendsDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT UID_ONE, UID_TWO FROM RELATIONS WHERE UID_ONE = ? OR UID_TWO = ?";
        SQL_BIND        = mysql.format(SQL, [uid, uid]);
        const result    = await query(SQL_BIND);
        if (result.length === 0) return DB_RESP(200, []);
        let AlreadyHasRelation = [];
        for (const i of result) {
            if (i.UID_ONE === uid) AlreadyHasRelation.push(i.UID_TWO);
            if (i.UID_TWO === uid) AlreadyHasRelation.push(i.UID_ONE);
        }
        SQL             = "SELECT * FROM USERS WHERE UID NOT IN ? AND MOBILE IN ? AND EMAIL IN ? AND EMAIL_CONFIRMED = 1";
        SQL_BIND        = mysql.format(SQL, [[AlreadyHasRelation], [list_mobile], [list_email]]);
        const result1   = await query(SQL_BIND);
        return DB_RESP(200, result1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetListFriendsDAO = async(uid) => {
    const FUNC_NAME = `GetListFriendsDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL                 = "SELECT * FROM RELATIONS WHERE UID_ONE = ? OR UID_TWO = ? AND TYPE = 'FRIEND'";
        SQL_BIND            = mysql.format(SQL, [uid, uid]);
        const result        = await query(SQL_BIND);
        let ListFriendsID   = [];
        for (const i of result) {
            if (i.UID_ONE === uid) ListFriendsID.push(i.UID_TWO);
            if (i.UID_TWO === uid) ListFriendsID.push(i.UID_ONE);
        }
        if (ListFriendsID.length === 0) return DB_RESP(200, []);
        SQL             = "SELECT * FROM USERS WHERE UID IN ?";
        SQL_BIND        = mysql.format(SQL, [[ListFriendsID]]);
        const result1   = await query(SQL_BIND);
        return DB_RESP(200, result1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}