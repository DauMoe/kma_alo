const {CatchErr, SuccessResp, RespCustomCode, readFile} = require("../../Utils/UtilsFunction");
const {GetJSONArray, GetString} = require("../../Utils/GetValue");
const {RecommendNewFriendsDAO, GetListFriendsDAO, SearchFriendDAO} = require("./FriendsDAO");
const path = require("path");
const FILE_NAME = " - FriendsController.js";

exports.RecommendNewFriends = async(req, resp) => {
    const FUNC_NAME = "RecommendNewFriends" + FILE_NAME;
    const uid = req.app.locals.uid;
    const reqData = req.body;
    try {
        const ListContacts = GetJSONArray(reqData, "list_contacts");
        if (ListContacts.length === 0) {
            SuccessResp(resp, {
                recommend_friends: []
            });
            return;
        }
        let errMsg = ""
        for (const [index, contact] of ListContacts.entries()) {
            if (!contact.hasOwnProperty("mobile") || !contact.hasOwnProperty("email")) {
                errMsg += `item index ${index} must have 'mobile' AND 'email' properties, `;
            }
        }
        if (errMsg.length > 0) {
            errMsg = errMsg.substring(0, errMsg.length - 2);
            RespCustomCode(resp, undefined, errMsg, 400);
        } else {
            let list_mobile = [], list_email = [];
            for (const contact of ListContacts) {
                if (contact.email.trim() !== "") list_email.push(contact.email);
                if (contact.mobile.trim() !== "") list_mobile.push(contact.mobile);
            }
            const result = await RecommendNewFriendsDAO(uid, list_mobile, list_email);
            const respData = [];
            if (result.code === 200) {
                for (const i of result.msg) {
                    respData.push({
                        uid         : i.UID         === null ? -1 : i.UID,
                        first_name  : i.FIRST_NAME  === null ? "" : i.FIRST_NAME,
                        last_name   : i.LAST_NAME   === null ? "" : i.LAST_NAME,
                        username    : i.USERNAME    === null ? "" : i.USERNAME,
                        avatar_text : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                        avatar_link : i.AVATAR_LINK === null ? "" : `/avatar/${i.AVATAR_LINK}`
                    });
                }
                SuccessResp(resp, {
                    recommend_friends: respData
                });
            } else {
                RespCustomCode(resp, undefined, result.msg, result.code);
            }
        }

    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.GetListFriends = async(req, resp) => {
    const FUNC_NAME = "GetListFriends" + FILE_NAME;
    const uid = req.app.locals.uid;
    try {
        const result = await GetListFriendsDAO(uid);
        const respData = [];
        if (result.code === 200) {
            let ListPromises = [];
            for (const i of result.msg) {
                respData.push({
                    uid         : i.UID             === null ? -1 : i.UID,
                    first_name  : i.FIRST_NAME      === null ? "" : i.FIRST_NAME,
                    last_name   : i.LAST_NAME       === null ? "" : i.LAST_NAME,
                    username    : i.USERNAME        === null ? "" : i.USERNAME,
                    avatar      : i.AVATAR_LINK     === null ? "" : i.AVATAR_LINK,
                    avatar_text : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    avatar_link : i.AVATAR_LINK     === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    display_name: `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    type        : i.TYPE,
                    send_request: i.SEND_REQUEST_AT === null ? "" : i.SEND_REQUEST_AT,
                    accept_at   : i.ACCEPT_AT === null || i.TYPE != 'FRIEND' ? "" : i.ACCEPT_AT
                });
            }
            const listAvatars = await Promise.all(ListPromises);
            for (const [index, avatar] of listAvatars.entries()) {
                respData[index].avatar = avatar;
            }
            SuccessResp(resp, {
                list_friends: respData
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.SearchFriend = async(req, resp) => {
    const FUNC_NAME = "SearchFriend" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.query;
    try {
        const query     = GetString(reqData, "q");
        const result    = await SearchFriendDAO(uid, query);
        if (result.code === 200) {
            const respData = [];
            for (const i of result.msg) {
                respData.push({
                    receiver_uid            : i.UID         === null ? -1 : i.UID,
                    receiver_first_name     : i.FIRST_NAME  === null ? "" : i.FIRST_NAME,
                    receiver_last_name      : i.LAST_NAME   === null ? "" : i.LAST_NAME,
                    receiver_username       : i.USERNAME    === null ? "" : i.USERNAME,
                    receiver_avatar_text    : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    receiver_avatar         : i.AVATAR_LINK === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    display_name            : `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    sender_id               : uid
                });
            }
            SuccessResp(resp, {
                result: respData
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}
