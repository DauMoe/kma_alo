import { applyMiddleware, combineReducers, createStore } from "redux";
import Comments from "./Comments/Reducers";
import Authenticator from './Authenticator/Reducers';
import { SIGNED_IN_SUCESS } from "./Authenticator/Actions";
import { setToken } from "./AxiosConfig";

const rootReducer = combineReducers({
    Comments, Authenticator
});

const saveToken = store => next => action => {
    const { type, data } = action;
    if (type === SIGNED_IN_SUCESS) {
        setToken(data.token);
    }
    return next(action);
};

const store = createStore(rootReducer, applyMiddleware(saveToken));

export default store;