//Write base64 to image: https://stackoverflow.com/questions/6926016/how-can-i-save-a-base64-encoded-image-to-disk

const {CatchErr, writeFile, SuccessResp, RespCustomCode} = require("../../Utils/UtilsFunction");
const {GetString, GetStringArray, GetNumber, GetJSONArray} = require("../../Utils/GetValue");
const fs = require("fs");
const path = require("path");
const {CreatePostDAO, DeletePostDAO, GetPostDAO, ReactionDAO} = require("./PostsDAO");

const FILE_NAME = " - PostController.js";

exports.CreatePost = async(req, resp) => {
    const FUNC_NAME = "CreatePost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const title     = GetString(reqData, "title");
        const content   = GetString(reqData, "content");
        const media     = GetJSONArray(reqData, "media");
        const ListMediaPaths = [];
        const ListPromise = [];
        for (const i of media) {
            const pathMedia = `_post_${new Date().getTime()}${path.extname(i.type)}`;
            ListMediaPaths.push(pathMedia);
            ListPromise.push(writeFile(path.join(__dirname, "..", "..", "public", "post", pathMedia), i.content.replace(/^data:image\/png;base64,/, ""), "base64"));
        }
        await Promise.all(ListPromise);
        const result = await CreatePostDAO(uid, title, content, ListMediaPaths);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.DeletePost = async(req, resp) => {
    const FUNC_NAME = "DeletePost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const post_id = GetNumber(reqData, "post_id");
        const result = await DeletePostDAO(post_id, uid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.GetPost = async(req, resp) => {
    const FUNC_NAME = "GetPost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.query;
    try {
        const offset    = GetNumber(reqData, "offset");
        const limit     = GetNumber(reqData, "limit");
        const result    = await GetPostDAO(uid, offset, limit);
        if (result.code === 200) {
            let respData = [];
            for (const i of result.msg) {
                const mediaLinks = [];
                for(const j of i.MEDIA_LINKS.split(",")) {
                    mediaLinks.push(`/post/${j}`);
                }
                respData.push({
                    post_id     : i.POST_ID         === null ? -1 : i.POST_ID,
                    author_id   : i.AUTHOR_ID       === null ? -1 : i.AUTHOR_ID,
                    title       : i.TITLE           === null ? -1 : i.TITLE,
                    content     : i.CONTENT         === null ? -1 : i.CONTENT,
                    uid         : i.UID             === null ? -1 : i.UID,
                    username    : i.USERNAME        === null ? "" : i.USERNAME,
                    first_name  : i.FIRST_NAME      === null ? -1 : i.FIRST_NAME,
                    last_name   : i.LAST_NAME       === null ? -1 : i.LAST_NAME,
                    avatar      : i.AVATAR_LINK     === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    avatar_text : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    display_name: `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    media       : (i.MEDIA_LINKS === "" || i.MEDIA_LINKS === null) ? [] : mediaLinks,
                    created_at  : i.CREATED_AT      === null ? -1 : i.CREATED_AT,
                    updated_at  : i.UPDATED_AT      === null ? -1 : i.UPDATED_AT
                })
            }
            SuccessResp(resp, {
                list_post   : respData,
                offset      : offset + respData.length,
                limit       : limit
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.Reaction = async(req, resp) => {
    const FUNC_NAME = "Reaction" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const post_id   = GetNumber(reqData, "post_id");
        const type      = GetNumber(reqData, "type");
        const result    = await ReactionDAO(post_id, uid, type);
        if (result.code === 200) {
            SuccessResp(resp, result.msg);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}