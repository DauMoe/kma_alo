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
        //Get your post after posted under 24 hours and friends posts + reactions
        SQL             = "SELECT a.*, b.FIRST_NAME, b.LAST_NAME, b.AVATAR_LINK, b.USERNAME, c.REACT_UID, c.TYPE, c.REACT_ID FROM POSTS a JOIN USERS b ON a.AUTHOR_ID = b.UID LEFT JOIN POST_REACTIONS c ON a.POST_ID = c.POST_ID WHERE (a.AUTHOR_ID = ? AND TIMESTAMPDIFF(HOUR, a.CREATED_AT, NOW()) < 24) OR (a.AUTHOR_ID IN ?) ORDER BY a.CREATED_AT DESC LIMIT ?,?";
        SQL_BIND        = mysql.format(SQL, [uid, [ListFriendIDs], offset, limit]);
        const result1   = await query(SQL_BIND);
        return DB_RESP(200, result1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.ReactionDAO = async(post_id, uid, type) => {
    const FUNC_NAME = `ReactionDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL = "SELECT REACT_ID, TYPE FROM POST_REACTIONS WHERE POST_ID = ? AND REACT_UID = ?";
        SQL_BIND = mysql.format(SQL, [post_id, uid]);
        const result = await query(SQL_BIND);
        if (result.length > 0) {
            //Already reaction before
            if (result[0].TYPE === Number(type)) {
                //Re-reaction the same type <=> delete
                SQL         = "DELETE FROM POST_REACTIONS WHERE POST_ID = ? AND REACT_UID = ?";
                SQL_BIND    = mysql.format(SQL, [post_id, uid]);
            } else {
                //Re-reaction difference type <=> change to another reaction
                SQL         = "UPDATE POST_REACTIONS SET TYPE = ? WHERE POST_ID = ? AND REACT_UID = ?";
                SQL_BIND    = mysql.format(SQL, [type, post_id, uid]);
            }
            await query(SQL_BIND);
            return DB_RESP(200, {
                mode    : result[0].TYPE === Number(type) ? "delete" : "update",
                post_id : post_id,
                uid     : uid
            });
        } else {
            SQL = "INSERT INTO POST_REACTIONS (REACT_UID, POST_ID, TYPE) VALUES (?, ?, ?)";
            SQL_BIND = mysql.format(SQL, [uid, post_id, type]);
            await query(SQL_BIND);
            return DB_RESP(200, {
                mode    : "insert",
                post_id : post_id,
                uid     : uid
            })
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetCommentDAO = async(post_id) => {
    const FUNC_NAME = `GetCommentDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT * FROM POST_COMMENTS WHERE POST_ID = ?";
        SQL_BIND        = mysql.format(SQL, [post_id]);
        const result    = await query(SQL_BIND);
        return DB_RESP(200, result);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.DeleteCommentDAO = async(comment_id, uid) => {
    const FUNC_NAME = `DeleteCommentDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT * FROM POST_COMMENTS WHERE COMMENT_ID = ? AND UID = ?";
        SQL_BIND        = mysql.format(SQL, [comment_id, uid]);
        const result    = await query(SQL_BIND);
        if (result.length === 0) return DB_RESP(401, "You are not allowed to delete this comment");
        SQL             = "DELETE FROM POST_COMMENTS WHERE COMMEND_ID = ?";
        SQL_BIND        = mysql.format(SQL, [comment_id]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.NewCommentDAO = async(content, media_link, post_id, uid) => {
    const FUNC_NAME = `NewCommentDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "INSERT INTO POST_COMMENTS (CONTENT, UID, POST_ID, MEDIA_LINK) VALUES (?, ?, ?, ?)";
        SQL_BIND        = mysql.format(SQL, [content, uid, post_id, media_link]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.EditCommentDAO = async(content, comment_id, uid) => {
    const FUNC_NAME = `EditCommentDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT * FROM POST_COMMENTS WHERE COMMENT_ID = ? AND UID = ?";
        SQL_BIND        = mysql.format(SQL, [comment_id, uid]);
        const result    = await query(SQL_BIND);
        if (result.length === 0) return DB_RESP(401, "You are not allowed to edit this comment");
        SQL             = "UPDATE POST_COMMENTS SET CONTENT = ? WHERE COMMENT_ID = ?";
        SQL_BIND        = mysql.format(SQL, [content, comment_id]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}