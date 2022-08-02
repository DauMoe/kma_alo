import { clearToken, DEFAULT_BASE_URL } from "../AxiosConfig";
import {
    HOST_IS_EXIST,
    HOST_IS_NOT_EXIST,
    SIGNED_IN_FAIL,
    SIGNED_IN_SUCESS,
    SIGNED_OUT_SUCESS,
    SIGNING_OUT,
    SINGING_IN,
    SIGNING_UP,
    TOKEN_IS_EXIST,
    TOKEN_IS_NOT_EXIST, SIGNED_UP_SUCCESS, SIGNED_UP_FAIL, SIGN_UP_ERROR, INIT_SIGN_UP_STATE
} from "./ActionTypes";

export const initState = {
    baseUrl     : DEFAULT_BASE_URL,
    loaded      : true,
    error       : false,
    error_code  : undefined,
    error_msg   : undefined,
    token       : undefined,
    first_check : true,
    signup_loaded: true,
    signup_err  : false,
    signup_err_msg: undefined
};

const Authenticator = function(state = initState, action) {
    const { type, data } = action;
    switch(type) {
        case SIGNING_OUT:
            return {
                ...state,
                token: undefined
            }
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
                token       : data
            }
        case SIGNED_IN_FAIL:
            const { err } = data;
            if (!err.status) {
                return {
                    ...state,
                    loaded      : true,
                    error       : true,
                    error_code  : 402,
                    error_msg   : `${err.message} || ${JSON.stringify(err)}`,
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
        case SIGNING_UP:
            return {
                ...state,
                signup_loaded: false
            }
        case SIGNED_UP_SUCCESS:
            console.log("OK ", data);
            return {
                ...state,
                signup_loaded       : true,
                sign_up_success_msg : data.description,
                signup_err          : false,
                signup_err_msg      : undefined
            }
        case SIGNED_UP_FAIL:
            const err1 = data.err;
            if (!err1.response) {
                return {
                    ...state,
                    signup_loaded       : true,
                    sign_up_success_msg : undefined,
                    signup_err          : true,
                    signup_err_msg      : err1
                }
            } else {
                return {
                    ...state,
                    signup_loaded       : true,
                    sign_up_success_msg : undefined,
                    signup_err          : true,
                    signup_err_msg      : err1.response.data.description,
                }
            }
        case INIT_SIGN_UP_STATE:
            return {
                ...state,
                signup_loaded       : true,
                sign_up_success_msg : undefined,
                signup_err          : false,
                signup_err_msg      : undefined,
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
