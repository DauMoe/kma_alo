const mysql = require("mysql2");
const {DB_ERR, DB_RESP} = require("../../Utils/UtilsFunction");
const {query} = require("../../Utils/DB_connection");
const FILE_NAME = " - PostsDAO.js";

exports.CreatePostDAO = async (uid, title, content, listMediaPath) => {
    const FUNC_NAME = `CreatePostDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL = "INSERT INTO POSTS (AUTHOR_ID, TITLE, CONTENT, MEDIA_LINKS) VALUES (?, ?, ?, ?)";
        SQL_BIND = mysql.format(SQL, [uid, title, content, listMediaPath.join(",")]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.DeletePostDAO = async(post_id, uid) => {
    const FUNC_NAME = `DeletePostDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT FROM POSTS WHERE POST_ID = ? AND AUTHOR_ID = ?";
        SQL_BIND        = mysql.format(SQL, [post_id, uid]);
        const result    = await query(SQL_BIND);
        if (result.length === 0) return DB_RESP(403, "You are not allowed to delete this post");
        SQL         = "DELETE FROM POSTS WHERE POST_ID = ?";
        SQL_BIND    = mysql.format(SQL, [post_id]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetPostDAO = async(uid, offset, limit) => {
    const FUNC_NAME = `GetPostDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL                 = "SELECT UID_ONE, UID_TWO FROM RELATIONS WHERE UID_ONE = ? OR UID_TWO = ?";
        SQL_BIND            = mysql.format(SQL, [uid, uid]);
        const result        = await query(SQL_BIND);
        let ListFriendIDs   = [];
        for (const i of result) {
            if (i.UID_ONE === uid) ListFriendIDs.push(i.UID_TWO);
            if (i.UID_TWO === uid) ListFriendIDs.push(i.UID_ONE);
        }
        if (ListFriendIDs.length === 0) return DB_RESP(200, []);
        //Get your post after posted under 24 hours and friends posts
        SQL             = "SELECT a.*, b.FIRST_NAME, b.LAST_NAME, b.AVATAR_LINK, b.USERNAME FROM POSTS a JOIN USERS b ON a.AUTHOR_ID = b.UID WHERE (a.AUTHOR_ID = ? AND TIMESTAMPDIFF(HOUR, a.CREATED_AT, NOW()) < 24) OR (a.AUTHOR_ID IN ?) ORDER BY a.CREATED_AT DESC LIMIT ?,?";
        SQL_BIND        = mysql.format(SQL, [uid, [ListFriendIDs], offset, limit]);
        const result1   = await query(SQL_BIND);
        return DB_RESP(200, result1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}