import { SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SIGNED_OUT_SUCESS, SINGING_IN } from "./Actions";

const initState = {
    loaded: false,
    error: false,
    error_msg: undefined,
    token: undefined
};

const Authenticator = function(state = initState, action) {
    const { type, data } = action;
    switch(type) {
        case SINGING_IN:
            return {
                ...state,
                loaded: false,
                error: false,
                error_msg: undefined,
                token: undefined
            }
        case SIGNED_IN_SUCESS:
            return {
                ...state,
                loaded: true,
                error: false,
                error_msg: undefined,
                token: data.token
            }
        case SIGNED_IN_FAIL:
            return {
                ...state,
                loaded: true,
                error: true,
                error_msg: data.description,
                token: undefined
            }
        case SIGNED_OUT_SUCESS:
            return {
                ...state,
                loaded: true,
                error: false,
                error_msg: undefined,
                token: undefined
            }
        default:
            return state;
    }
}

export default Authenticator;