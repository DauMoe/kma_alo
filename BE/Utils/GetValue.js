const CheckInputType = (data, field, required) => {
    if (typeof(data) !== "object") throw TypeError("First arg must be a JSON Object");
    if (required) {
        if (!data.hasOwnProperty(field)) throw Error(`'${field}' is required!`);
    }
}

module.exports = {
     GetNumber: (data, field, required = true) => {
        CheckInputType(data, field, required);
        let msg = data[`${field}`];
        if (msg === undefined && !required) return -1;
        msg = Number.parseInt(data[`${field}`]);
        if (isNaN(msg)) throw TypeError(`'${field}' must be a number`);
        return msg;
    },

    GetBoolean: (data, field, required = true) => {
        CheckInputType(data, field, required);
        let msg = data[`${field}`];
        if (msg === undefined && !required) return false;
        msg = Boolean(data[`${field}`]);
        return msg;
    },

     GetString: (data, field, required = true) => {
        CheckInputType(data, field, required);
        let msg = data[`${field}`];
        if (msg === undefined && !required) return "";
        if (typeof (msg) === "object") throw TypeError(`'${field}' must be a string but get an object`);
        return msg;
    },

     GetStringArray: (data, field, required = true) => {
        CheckInputType(data, field, required);
        let msg = data[`${field}`];
        if (Array.isArray(msg) === false) throw TypeError(`'${field}' must be an array`);
        return msg;
    },

     GetJSONArray: (data, field, required = true) => {
        CheckInputType(data, field, required);
        let msg = data[`${field}`];
        if (msg === undefined && !required) return [];
        if (Array.isArray(msg) === false) throw TypeError(`'${field}' must be an array`);
        msg.map((item, index) => {
            try {
                JSON.parse(JSON.stringify(item));
            } catch (e) {
                throw TypeError(`Item at index ${index} not a JSON`);
            }
        });
        return msg;
    }   
}