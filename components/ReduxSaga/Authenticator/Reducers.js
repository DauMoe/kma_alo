import { clearToken, DEFAULT_BASE_URL } from "../AxiosConfig";
import { HOST_IS_EXIST, HOST_IS_NOT_EXIST, SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SIGNED_OUT_SUCESS, SINGING_IN, TOKEN_IS_EXIST, TOKEN_IS_NOT_EXIST } from "./ActionTypes";

export const initState = {
    baseUrl     : DEFAULT_BASE_URL,
    loaded      : true,
    error       : false,
    error_code  : undefined,
    error_msg   : undefined,
    token       : undefined,
    first_check : true
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
            return {
                ...state,
                loaded      : true,
                error       : false,
                error_code  : undefined,
                error_msg   : undefined,
                token       : data.token
            }
        case SIGNED_IN_FAIL:
            // console.log("FAIL: ", JSON.stringify(data));
            const { err } = data;
            console.log("TATUS: ", err.status);
            if (!err.status) {
                return {
                    ...state,
                    loaded      : true,
                    error       : true,
                    error_code  : 402,
                    error_msg   : `Can't connect to server (${state.baseUrl})`,
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
            clearToken();
            return {
                ...state,
                loaded      : true,
                error       : false,
                error_code  : undefined,
                error_msg   : undefined,
                token       : undefined
            }
        case TOKEN_IS_NOT_EXIST:
            return {
                ...state,
                token: undefined,
                first_check: false
            }
        case TOKEN_IS_EXIST:
            return {
                ...state,
                token: data.token,
                first_check: false
            }
        case HOST_IS_EXIST:
            return {
                ...state,
                baseUrl: data.baseUrl
            }
        case HOST_IS_NOT_EXIST:
            return {
                ...state,
                baseUrl: DEFAULT_BASE_URL
            }
        default:
            return state;
    }
}

export default Authenticator;