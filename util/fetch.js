const fetch = require("node-fetch");
const codes = require('./codes').codes;

const validateResponse = async response => {
    const promise = new Promise((resolve, reject) => {
        response.text().then((responseText) => {
            try {
                const responseData = JSON.parse(responseText);

                if (responseData.error && responseData.error.message) {
                    return reject(responseData.error);
                }

                if (responseData.success === false) {
                    const error = new Error(responseData.message);
                    error.code = responseData.code;
                    return reject(error)
                }

                resolve(responseData);
            }
            catch (error) {
                reject(error);
            }

        });
    });

    return await promise;
};

const isValidJson = json => {
    try {
        if (typeof json)
            JSON.parse(json);
        return true;
    }
    catch (error) {
        return false;
    }
};


module.exports.get = async (url, options) => {

    try {
        //console.log("url :",url," Options :" , options);
        const result = await fetch(url, options);
        const data = await validateResponse(result);
        return data;
    }
    catch (error) {
        console.log('step 2: ', url);
        error.isError = true;
        return {
            error,
            message: error.message
        };
    }
};


