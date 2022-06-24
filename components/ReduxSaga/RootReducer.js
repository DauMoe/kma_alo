import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import Comments, { initState as initStateComments } from "./Comments/Reducers";
import Authenticator, { initState as initStateAuthen} from './Authenticator/Reducers';
import createSagaMiddleware from "redux-saga";
import rootSaga from "./RootSaga";

const sagaMiddleware    = createSagaMiddleware();
const middlewares       = [sagaMiddleware];

const rootReducer = combineReducers({
    Comments, Authenticator
});

const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(rootSaga);

export default store;