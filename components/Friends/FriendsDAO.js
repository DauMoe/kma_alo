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
        if (list_mobile.length > 0) {
            SQL             = "SELECT * FROM USERS WHERE UID NOT IN ? AND MOBILE IN ? AND EMAIL_CONFIRMED = 1";
            SQL_BIND        = mysql.format(SQL, [[AlreadyHasRelation], [list_mobile]]);
            const result1   = await query(SQL_BIND);
            return DB_RESP(200, result1);
        }
        return DB_RESP(200, []);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetListFriendsDAO = async(uid) => {
    const FUNC_NAME = `GetListFriendsDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL                 = "SELECT * FROM RELATIONS WHERE UID_ONE = ? OR UID_TWO = ? AND TYPE = 'FRIEND' OR TYPE = 'PENDING'";
        SQL_BIND            = mysql.format(SQL, [uid, uid]);
        const result        = await query(SQL_BIND);
        let ListFriendsID   = [], FriendsInfo = [];
        for (const i of result) {
            if (i.UID_ONE === uid) {
                ListFriendsID.push(i.UID_TWO);
                FriendsInfo.push({
                    uid: i.UID_TWO,
                    type: i.TYPE,
                    created_at: i.CREATED_AT,
                    updated_at: i.UPDATED_AT
                })
            }
            if (i.UID_TWO === uid) {
                ListFriendsID.push(i.UID_ONE);
                FriendsInfo.push({
                    uid: i.UID_ONE,
                    type: i.TYPE === "PENDING" ? "WAITING" : i.TYPE,
                    created_at: i.CREATED_AT,
                    updated_at: i.UPDATED_AT
                })
            }
        }
        if (ListFriendsID.length === 0) return DB_RESP(200, []);
        SQL             = "SELECT * FROM USERS WHERE UID IN ?";
        SQL_BIND        = mysql.format(SQL, [[ListFriendsID]]);
        const result1   = await query(SQL_BIND);
        const data = [];
        for (const friend of result1) {
            const index = ListFriendsID.indexOf(friend.UID);
            if (index > -1) {
                data.push({
                    ...friend,
                    TYPE            : FriendsInfo[index].type,
                    SEND_REQUEST_AT : FriendsInfo[index].created_at,
                    ACCEPT_AT       : FriendsInfo[index].updated_at
                });
            }
        }
        return DB_RESP(200, data);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.SearchFriendDAO = async(uid, q) => {
    const FUNC_NAME = `SearchFriendDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT UID_ONE, UID_TWO FROM RELATIONS WHERE UID_ONE = ? OR UID_TWO = ?";
        SQL_BIND        = mysql.format(SQL, [uid, uid]);
        const result    = await query(SQL_BIND);
        if (result.length === 0) return DB_RESP(200, []);
        let ListUID     = [];
        for (const i of result) {
            if (i.UID_ONE === uid) ListUID.push(i.UID_TWO);
            if (i.UID_TWO === uid) ListUID.push(i.UID_ONE);
        }
        SQL             = "SELECT * FROM USERS WHERE UID IN ? AND (FIRST_NAME LIKE ? OR LAST_NAME LIKE ? OR USERNAME LIKE ? OR MOBILE LIKE ?)";
        SQL_BIND        = mysql.format(SQL, [[ListUID], `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]);
        const result1   = await query(SQL_BIND);
        return DB_RESP(200, result1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.AddFriendDAO = async(from_uid, to_uid) => {
    const FUNC_NAME = `AddFriendDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL = "SELECT * FROM RELATIONS WHERE (UID_ONE = ? AND UID_TWO = ?) OR (UID_ONE = ? AND UID_TWO = ?)";
        SQL_BIND = mysql.format(SQL, [from_uid, to_uid, to_uid, from_uid]);
        const result = await query(SQL_BIND);
        if (result.length === 0) {
            SQL             = "INSERT INTO RELATIONS (UID_ONE, UID_TWO, TYPE) VALUES (?, ?, 'PENDING')";
            SQL_BIND        = mysql.format(SQL, [from_uid, to_uid]);
            await query(SQL_BIND);
            return DB_RESP(200);
        } else {
            return DB_RESP(400, "You already send friend request or you're friend");
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.CancelFriendRequestDAO = async(from_uid, to_uid) => {
    const FUNC_NAME = `CancelFriendRequestDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "DELETE FROM RELATIONS WHERE (UID_ONE = ? AND UID_TWO = ?) OR (UID_ONE = ? AND UID_TWO = ?)";
        SQL_BIND        = mysql.format(SQL, [from_uid, to_uid, to_uid, from_uid]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.AcceptFriendRequestDAO = async(from_uid, to_uid) => {
    const FUNC_NAME = `AcceptFriendRequestDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "UPDATE RELATIONS SET TYPE = 'FRIEND' WHERE (UID_ONE = ? AND UID_TWO = ?) OR (UID_ONE = ? AND UID_TWO = ?)";
        SQL_BIND        = mysql.format(SQL, [from_uid, to_uid, to_uid, from_uid]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}
