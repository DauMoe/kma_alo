import {
    CHECK_ALL_LOCAL_DATA,
    HOST_IS_EXIST,
    HOST_IS_NOT_EXIST,
    SIGNED_IN_FAIL,
    SIGNED_IN_SUCESS, SIGNED_UP_FAIL, SIGNED_UP_SUCCESS,
    SINGING_IN,
    SIGNING_UP,
    TOKEN_IS_EXIST,
    TOKEN_IS_NOT_EXIST, INIT_SIGN_UP_STATE
} from "./ActionTypes";

export function LocalLoginAction(username, password) {
    return {
        type: SINGING_IN,
        data: { username, password }
    }
}

export function LocalAuthenFail(err) {
    return {
        type: SIGNED_IN_FAIL,
        data: { err }
    }
}

export function LocalAuthenSuccess(data) {
    console.log("token: ", data);
    return {
        type: SIGNED_IN_SUCESS,
        data: data
    }
}

export function LocalSignupAction({first_name, last_name, username, email, mobile, password}) {
    return {
        type: SIGNING_UP,
        data: { first_name, last_name, username, email, mobile, password }
    }
}

export function LocalSignupFail(err) {
    return {
        type: SIGNED_UP_FAIL,
        data: { err }
    }
}

export function LocalSignSuccess(description) {
    return {
        type: SIGNED_UP_SUCCESS,
        data: description
    }
}

export function CheckAllLocalData() {
    return {
        type: CHECK_ALL_LOCAL_DATA
    }
}

export function InitSignupState() {
    return {
        type: INIT_SIGN_UP_STATE
    }
}

export function HostIsNotExist() {
    return {
        type: HOST_IS_NOT_EXIST
    }
}

export function HostExist(host) {
    return {
        type: HOST_IS_EXIST,
        data: host
    }
}

export function TokenIsNotExist() {
    return {
        type: TOKEN_IS_NOT_EXIST
    }
}

export function TokenIsExist(token) {
    return {
        type: TOKEN_IS_EXIST,
        data: token
    }
}