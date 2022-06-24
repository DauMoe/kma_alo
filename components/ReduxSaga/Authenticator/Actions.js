import { SIGNED_IN_FAIL, SIGNED_IN_SUCESS, SINGING_IN } from "./ActionTypes";

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