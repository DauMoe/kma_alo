const {CatchErr, SuccessResp, RespCustomCode, readFile} = require("../../Utils/UtilsFunction");
const {GetJSONArray, GetString, GetNumber} = require("../../Utils/GetValue");
const {RecommendNewFriendsDAO, GetListFriendsDAO, SearchFriendDAO, AddFriendDAODAO, AddFriendDAO,
    CancelFriendRequestDAO
} = require("./FriendsDAO");
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
            if (!contact.hasOwnProperty("mobile")) {
                errMsg += `item index ${index} must have 'mobile' properties, `;
            }
        }
        if (errMsg.length > 0) {
            errMsg = errMsg.substring(0, errMsg.length - 2);
            RespCustomCode(resp, undefined, errMsg, 400);
        } else {
            let list_mobile = []
            for (const contact of ListContacts) {
                if (contact.mobile.trim() !== "") list_mobile.push(contact.mobile);
            }
            const result = await RecommendNewFriendsDAO(uid, list_mobile);
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
        const ListFriends = [], ListPendingRequest = [];
        if (result.code === 200) {
            for (const i of result.msg) {
                const item = {
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
                };
                if (i.TYPE === "FRIEND") ListFriends.push(item);
                if (i.TYPE === "PENDING") ListPendingRequest.push(item);
            }
            SuccessResp(resp, {
                list_friends: ListFriends,
                pending_request: ListPendingRequest
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
                    uid            : i.UID         === null ? -1 : i.UID,
                    first_name     : i.FIRST_NAME  === null ? "" : i.FIRST_NAME,
                    last_name      : i.LAST_NAME   === null ? "" : i.LAST_NAME,
                    username       : i.USERNAME    === null ? "" : i.USERNAME,
                    display_name   : `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    avatar_text    : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    avatar_link    : i.AVATAR_LINK === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    display_name   : `${i.FIRST_NAME} ${i.LAST_NAME}`
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

exports.AddFriend = async(req, resp) => {
    const FUNC_NAME = "AddFriend" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const target_uid    = GetString(reqData, "uid");
        const result        = await AddFriendDAO(uid, target_uid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.CancelRequest = async(req, resp) => {
    const FUNC_NAME = "CancelRequest" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const target_uid    = GetNumber(reqData, "uid");
        const result        = await CancelFriendRequestDAO(uid, target_uid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}
