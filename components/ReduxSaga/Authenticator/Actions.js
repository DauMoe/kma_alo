import { CHECK_ALL_LOCAL_DATA, HOST_IS_EXIST, HOST_IS_NOT_EXIST, SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SINGING_IN, TOKEN_IS_EXIST, TOKEN_IS_NOT_EXIST } from "./ActionTypes";

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
    return {
        type: SIGNED_IN_SUCESS,
        data: data
    }
}

export function CheckAllLocalData() {
    return {
        type: CHECK_ALL_LOCAL_DATA
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