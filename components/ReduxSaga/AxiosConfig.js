import axios from "axios";
import { HOST_TABLE, HOST_TB_CREATE_AT, HOST_TB_VALUE, TOKEN_TABLE, TOKEN_TB_VALUE } from "../Definition";
import { _db } from '../Utils';

const PRODUCTION_URL                = "http://20.89.56.87:8000";
const TEST_URL                      = "http://192.168.1.36:8080";
const OTHER_URL                     = "http://192.168.110.65:8080";
export const DEFAULT_BASE_URL       = OTHER_URL;

export const setToken = function(token) {
    console.info("TOKEN: ", token);
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearToken = function(token) {
    // instance.defaults.headers.common['Authorization'] = undefined;
    const SQL = `DELETE FROM ${TOKEN_TABLE} (${TOKEN_TB_VALUE}) VALUES (?)`;
    _db.transaction(function(tx) {
        tx.executeSql(
            SQL, [token], function(tx1, result) {
                console.log("delete");
                console.log(result);
            }
        );
    });
};

import store from './RootReducer';

store.subscribe(function() {
    const { token, baseUrl } = store.getState().Authenticator;
    // console.log("TOKEN: ", token, baseUrl);
    if (token)      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (baseUrl)    axios.defaults.baseURL = baseUrl;
});

export const setBaseUrl = function(baseURL) {
    axios.defaults.baseURL = baseURL;
    _db.transaction(function(tx) {
        tx.executeSql(`INSERT INTO ${HOST_TABLE} (${HOST_TB_VALUE}) VALUES (?)`, [baseURL]);
    });
}

export const axiosConfig = function(endpoint, method, config) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiaG9hbmduZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRhdW1vZSIsImlhdCI6MTY1NjI1NjA5NywiZXhwIjoxODcyMjU2MDk3fQ.cotV9sFZeH5p3w-iu25mE2FGxw2id0VOfEwWCVmNQy4";
    const instance = axios.create({
        baseURL: DEFAULT_BASE_URL
    });
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    switch(method.toUpperCase()) {
        case "GET":
            return instance.get(endpoint, config);
        case "POST":
            return instance.post(endpoint, config);
        case "PUT":
            return instance.put(endpoint, config);
        case "DELETE":
            return instance.delete(endpoint, config);
        default:
            return new Error(`Method '${method}' is not supported!`);
    }
}