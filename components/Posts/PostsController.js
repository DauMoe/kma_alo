//Write base64 to image: https://stackoverflow.com/questions/6926016/how-can-i-save-a-base64-encoded-image-to-disk

const {CatchErr, writeFile, SuccessResp, RespCustomCode} = require("../../Utils/UtilsFunction");
const {GetString, GetStringArray, GetNumber, GetJSONArray, GetBoolean} = require("../../Utils/GetValue");
const fs = require("fs");
const path = require("path");
const {CreatePostDAO, DeletePostDAO, GetPostDAO, ReactionDAO, NewCommentDAO, GetCommentDAO, DeleteCommentDAO,
    EditCommentDAO
} = require("./PostsDAO");

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
    const reqData   = req.query;
    try {
        const uid       = GetNumber(reqData, "uid", false) === -1 ? req.app.locals.uid : GetNumber(reqData, "uid", false);
        const offset    = GetNumber(reqData, "offset");
        const limit     = GetNumber(reqData, "limit");
        const ownPost   = GetBoolean(reqData, "own_post", false);
        const result    = await GetPostDAO(uid, offset, limit, ownPost);
        if (result.code === 200) {
            let respData = [], existedPostId = [];
            for (const i of result.msg) {
                const mediaLinks = [];
                for(const j of i.MEDIA_LINKS.split(",")) {
                    mediaLinks.push(`/post/${j}`);
                }
                const reactionsIndex = existedPostId.indexOf(i.POST_ID);
                if (reactionsIndex === -1) {
                    const item = {
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
                        updated_at  : i.UPDATED_AT      === null ? -1 : i.UPDATED_AT,
                        reactions   : []
                    };
                    if (i.TYPE !== null) {
                        item.reactions.push({
                            type    : i.TYPE,
                            uid     : i.REACT_UID,
                            post_id : i.POST_ID
                        });
                    }
                    respData.push(item);
                    existedPostId.push(i.POST_ID);
                } else {
                    if (i.TYPE !== null) {
                        respData[reactionsIndex].reactions.push({
                            type    : i.TYPE,
                            uid     : i.REACT_UID,
                            post_id : i.POST_ID
                        });
                    }
                }
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

exports.NewComment = async(req, resp) => {
    const FUNC_NAME = "NewComment" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const content   = GetString(reqData, "content");
        const media     = GetJSONArray(reqData, "media");
        const post_id   = GetNumber(reqData, "post_id");
        const pathMedia = media.length === 0 ? "" : `_comment_${new Date().getTime()}${path.extname(media.type)}`
        if (media.length > 0) {
            await writeFile(path.join(__dirname, "..", "..", "public", "post", pathMedia), media.content.replace(/^data:image\/png;base64,/, ""), "base64")
        }
        const result    = await NewCommentDAO(content, pathMedia, post_id, uid);
        if (result.code === 200) {
            SuccessResp(resp, result.msg);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.GetComments = async(req, resp) => {
    const FUNC_NAME = "GetComments" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.query;
    try {
        const post_id   = GetString(reqData, "post_id");
        const result    = await GetCommentDAO(post_id);
        if (result.code === 200) {
            const ListComments = [];
            for(const i of result.msg) {
                const mediaLinks = [];
                if (i.MEDIA_LINKS) {
                    for(const j of i.MEDIA_LINKS.split(",")) {
                        mediaLinks.push(`/post/${j}`);
                    }
                }
                ListComments.push({
                    comment_id  : i.COMMENT_ID      === null ? -1 : i.COMMENT_ID,
                    uid         : i.UID             === null ? -1 : i.UID,
                    username    : i.USERNAME        === null ? "" : i.USERNAME,
                    first_name  : i.FIRST_NAME      === null ? -1 : i.FIRST_NAME,
                    last_name   : i.LAST_NAME       === null ? -1 : i.LAST_NAME,
                    avatar      : i.AVATAR_LINK     === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    avatar_text : `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    display_name: `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    content     : i.CONTENT         === null ? "" : i.CONTENT,
                    media       : (i.MEDIA_LINKS === "" || i.MEDIA_LINKS === null) ? [] : mediaLinks,
                    post_id     : i.POST_ID         === null ? -1 : i.POST_ID,
                    created_at  : i.CREATED_AT      === null ? "" : i.CREATED_AT,
                    updated_at  : i.UPDATED_AT      === null ? "" : i.UPDATED_AT
                });
            }
            SuccessResp(resp, ListComments);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.DeleteComment = async(req, resp) => {
    const FUNC_NAME = "DeleteComment" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const comment_id    = GetNumber(reqData, "comment_id");
        const result        = await DeleteCommentDAO(comment_id, uid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.EditComment = async(req, resp) => {
    const FUNC_NAME = "EditComment" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const content       = GetString(reqData, "content");
        const comment_id    = GetNumber(reqData, "comment_id");
        const result        = await EditCommentDAO(content, comment_id, uid);
        if (result.code === 200) {
            SuccessResp(resp, result.msg);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}
