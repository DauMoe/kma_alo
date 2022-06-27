import axios from "axios";
import { HOST_TABLE, HOST_TB_CREATE_AT, HOST_TB_VALUE, TOKEN_TABLE, TOKEN_TB_VALUE } from "../Definition";
import { _db } from '../Utils';

export const DEFAULT_BASE_URL = "http://192.168.1.36:8080";

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
    const instance = axios.create();
    console.log("INSTANCE: ", instance.defaults);
    switch(method.toUpperCase()) {
        case "GET":
            const get_method = instance.get(endpoint, config);
            return get_method;
        case "POST":
            const x = instance.post(endpoint, config);
            return x;
        case "PUT":
            return instance.put(endpoint, config);
        case "DELETE":
            return instance.delete(endpoint, config);
        default:
            return new Error(`Method '${method}' is not supported!`);
    }
}