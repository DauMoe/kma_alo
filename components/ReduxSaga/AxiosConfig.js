import axios from "axios";
import { TOKEN_TABLE, TOKEN_TB_VALUE } from "../Definition";
import { _db } from '../Utils';

export const DEFAULT_BASE_URL = "http://192.168.1.36:8080";

const instance = axios.create({
    timeout: 1000 * 1,
    baseURL: DEFAULT_BASE_URL
});

export const setBaseUrl = function(baseURL) {
    instance.defaults.baseURL = baseURL;
}

export const setToken = function(token) {
    console.info("TOKEN: ", token);
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const SQL = `INSERT INTO ${TOKEN_TABLE} (${TOKEN_TB_VALUE}) VALUES (?)`;
    // _db.transaction(function(tx) {
    //     tx.executeSql(
    //         SQL, [token], function(tx1, result) {
    //             console.log("ok");
    //             console.log(result);
    //         }
    //     );
    // });
};

export const clearToken = function(token) {
    instance.defaults.headers.common['Authorization'] = undefined;
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

export const axiosConfig = function(endpoint, method, config) {
    // console.log("BaseURL: ", instance.defaults.baseURL);
    method = method.toUpperCase();
    switch(method) {
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
};