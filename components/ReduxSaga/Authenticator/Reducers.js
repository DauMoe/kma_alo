import { clearToken, DEFAULT_BASE_URL, setToken } from "../AxiosConfig";
import { HOST_IS_EXIST, HOST_IS_NOT_EXIST, SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SIGNED_OUT_SUCESS, SINGING_IN, TOKEN_IS_EXIST, TOKEN_IS_NOT_EXIST } from "./ActionTypes";

export const initState = {
    url         : DEFAULT_BASE_URL,
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
            setToken(data.token);
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
            setToken("Test");
            const { err } = data;
            if (err.code === "ECONNABORTED") {
                return {
                    ...state,
                    loaded      : true,
                    error       : true,
                    error_code  : 402,
                    error_msg   : "Can't connect to server",
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
                token: undefined
            }
        case TOKEN_IS_EXIST:
            console.info("TOKEN EXIST: ", data);
            return {
                ...state,
                token: data.token
            }
        case HOST_IS_EXIST:
            console.info("HOST EXIST: ", data);
            return {
                ...state,
                url: data.url
            }
        case HOST_IS_NOT_EXIST:
            return {
                ...state,
                url: DEFAULT_BASE_URL
            }
        default:
            return state;
    }
}

export default Authenticator;