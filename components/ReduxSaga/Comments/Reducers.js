import { LOADING_COMMENT, LOAD_COMMENT_FAIL, LOAD_COMMENT_SUCCESS } from './Actions';

const initState = {
    loaded  : true,
    error   : false,
    error_msg: undefined,
    data    : []
};

const Comments = function(state = initState, action) {
    const {type, data} = action;
    switch(type) {
        case LOADING_COMMENT:
            return {
                ...state,
                loaded: false,
                error: false,
                error_msg: undefined,
                data: []
            }
        case LOAD_COMMENT_FAIL:
            return {
                ...state,
                loaded: true,
                error: true,
                error_msg: "",
                data: []
            }
        case LOAD_COMMENT_SUCCESS:
            return {
                ...state,
                loaded: true,
                error: false,
                error_msg: undefined,
                data: data
            }
        default:
            return state;
    }
}

export default Comments;