import { LOADING_COMMENT, LOAD_COMMENT_FAIL } from './Actions';

export function GetComments(postId) {
    return {
        type: LOADING_COMMENT,
        data: {
            postId: postId
        }
    }
}

export function GetCommentsFail() {
    return {
        type: LOAD_COMMENT_FAIL
    }
}