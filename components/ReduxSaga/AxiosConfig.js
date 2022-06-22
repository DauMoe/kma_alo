import axios from "axios";

const instance = axios.create({
    timeout: 1000 * 60
});

export const setBaseUrl = function(baseURL) {
    instance.defaults.baseURL = baseURL;
}

export const setToken = function(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const axiosConfig = function() {
    console.log("BaseURL: ", instance.defaults.baseURL);
    return instance;
};