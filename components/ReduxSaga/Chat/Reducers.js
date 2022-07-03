import {LOADED_LIST_CHATS_FAIL, LOADED_LIST_CHATS_SUCCESS, LOADING_LIST_CHATS} from "./ActionTypes";
import {LOAD_COMMENT_FAIL, LOAD_COMMENT_SUCCESS, LOADING_COMMENT} from "../Comments/Actions";

export const initState = {
    loaded  : false,
    error   : false,
    error_msg: undefined,
    data    : []
};

const Chats = function(state = initState, action) {
    const { type, data } = action;

    switch (type) {
        case LOADING_LIST_CHATS:
            return {
                ...state,
                loaded: false,
                error: false,
                error_msg: undefined,
                data: []
            }
        case LOADED_LIST_CHATS_SUCCESS:
            return {
                ...state,
                loaded: true,
                error: false,
                error_msg: undefined,
                data: data
            }
        case LOADED_LIST_CHATS_FAIL:
            return {
                ...state,
                loaded: true,
                error: true,
                error_msg: "",
                data: []
            }
        default:
            return state;
    }
}

export default Chats;