const logger = require('./logger');
const util = require('.');

const jsonFormat = {
    code: -1,
    success: false,
    message: '',
    data: [],
    baseId: -1,
    error: {},
    sentAt: '' 
};


const sendResponse = (res, data) => {
    res.json(data);
};


const unauthorized = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 403;
    json.message = 'Unauthorized request. It seems either you didn\'t provide the auth token, or you don\'t have the access to the module you are calling' ;
    sendResponse(res, json);
};


const invalidToken = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 403;
    json.message = 'Invalid Token. Token may have been expired or altered with. Please relogin and try again';

    sendResponse(res, json);
};


const invalidApp = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 404;
    json.message = 'App not found. Please provide a valid appname and try again';

    sendResponse(res, json);
};


const success = (res, code, data, message, baseId, recordsCount) => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = code;
    json.success = true;
    json.data = data;
    json.message = message;
    json.baseId = baseId;
    json.sentAt = new Date();
    json.recordsCount = recordsCount;
    //console.log("success result : ",json);
    sendResponse(res, json);
};


const convertToCSV = data => {
    const finalCSVData = [];

    const headers = {};
    let rowIndex = 0;

    data.forEach(json => {
        json.forEach(jsonData => {
            
            Object.keys(jsonData).forEach(key => {
                const obj = jsonData[key];
            
                if (!headers[key]) {
                    headers[key] = {};
                }
                headers[key][rowIndex] = obj;
            })
            rowIndex = rowIndex + 1;
        });
    });

    const values = [];

    for (let index = 0; index < rowIndex; index ++) {
        let row = undefined;
        let header = undefined
        Object.keys(headers).forEach(key => {

            if (values.length === 0) {
                if (typeof header === 'undefined') {
                    header = key;
                }
                else {
                    header = header + ';' + key;
                }
            }

            if (typeof row === 'undefined') {
                row = headers[key][index];
            }
            else {
                row = row + ';' + (headers[key][index] ? headers[key][index] : '');
            }
        });

        if (values.length === 0) {
            values.push(header);
        }
        values.push(row);
    }

    return values;
};


const sendCSV = (res, code, data, message, baseId, recordsCount) => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = code;
    json.success = true;
    json.data = data;
    json.message = message;
    json.baseId = baseId;
    json.sentAt = new Date();
    json.recordsCount = recordsCount;

    // res.set('Content-Type', 'application/octet-stream');
    // res.attachment('filename.csv');
    const csvData = convertToCSV(data);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    res.send(csvData.join('\n'));
};


const error = (res, error, errorCode, source) => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = errorCode ? errorCode : 502;
    json.message = error ? util.drillDownErrorMessage(error) : 'No error info found';
    json.error = error;
    // send email only when the error is undefined or the fatal error
    console.log('source in error: ', source, error, errorCode);
    logger.logError('', '', error, (typeof errorCode === 'undefined' || errorCode === 502));
    sendResponse(res, json);
};


const unChanged = res => {
    const json = JSON.parse(JSON.stringify(jsonFormat));
    json.code = 304;
    json.success = true;
    json.data = [];

    sendResponse(res, json);
};

module.exports.error = error;
module.exports.unauthorized = unauthorized;
module.exports.success = success;
module.exports.invalidToken = invalidToken;
module.exports.unChanged = unChanged;
module.exports.invalidApp = invalidApp;
module.exports.sendCSV = sendCSV;
