import { SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SIGNED_OUT_SUCESS, SINGING_IN } from "./ActionTypes";

export const initState = {
    loaded      : true,
    error       : false,
    error_code  : undefined,
    error_msg   : undefined,
    token       : undefined
};

const Authenticator = function(state = initState, action) {
    const { type, data } = action;
    switch(type) {
        case SINGING_IN:
            return {
                ...state,
                loaded      : false,
                error       : false,
                error_code  : undefined,
                error_msg   : undefined,
                token       : undefined
            }
        case SIGNED_IN_SUCESS:
            console.log("OK: ", data);
            return {
                ...state,
                loaded      : true,
                error       : false,
                error_code  : undefined,
                error_msg   : undefined,
                token       : data.token
            }
        case SIGNED_IN_FAIL:
            console.log("FAIL: ", data);
            const { err } = data;
            if (err.code === "ECONNABORTED") {
                return {
                    ...state,
                    loaded      : true,
                    error       : true,
                    error_code  : 402,
                    error_msg   : "Can not connect to server",
                    token       : undefined
                }    
            }
            return {
                ...state,
                loaded      : true,
                error       : true,
                error_code  : err.response.status,
                error_msg   : err.response.data.description,
                token       : undefined
            }
        case SIGNED_OUT_SUCESS:
            return {
                ...state,
                loaded      : true,
                error       : false,
                error_code  : undefined,
                error_msg   : undefined,
                token       : undefined
            }
        default:
            return state;
    }
}

export default Authenticator;