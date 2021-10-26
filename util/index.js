const path = require('path');
const logger = require('./logger');
const uuid = require('uuid/v4');
const config = require('../config').config;
const requiredFields = require('../config').requiredFields;
const jwt = require('jsonwebtoken');
const responseHelper = require('./response.helper');
const codes = require('./codes').codes;
const fs = require('fs');
const specialEmails = require('./email/specialEmails').emails;
const url = require('url');
const constants = require('./constants');
const jimp = require('jimp');


const publicKey = fs.readFileSync(__dirname + '/keys/public.key', 'utf8').toString();
const privateKey = fs.readFileSync(__dirname + '/keys/private.key', 'utf8').toString();

let appName = '';

/**
 * Credits:
 *      user: kip - https://stackoverflow.com/users/18511/kip
 *      url: https://stackoverflow.com/a/1214753/18511
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * 
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
const dateAdd = (date, interval, units) => {
    var ret = new Date(date); //don't change original date
    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };

    switch (interval.toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
};


const setApp = appName => {
    this.appName = appName;
};


/**
 * @param {Boolean} useTime returns the string including time
 * @param {Boolean} useMillis returns the string including milliseconds
 * returns a string looking like date
 */
const getNowObject = (useTime, useMillis) => {
    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (useTime === true) {
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let millisecond = date.getMilliseconds();

        if (hour.length < 2) hour = '0' + hour;
        if (minute.length < 2) minute = '0' + minute;
        if (second.length < 2) second = '0' + second;
        if (millisecond.length < 2) millisecond = '0' + millisecond;

        if (useMillis) {
            return [year, month, day, hour, minute, second, millisecond].join('.');
        }
        else {
            return [year, month, day, hour, minute, second].join('.');
        }
    }
    else {
        return [year, month, day].join('.');
    }

};

/**
 * 
 * @param {*} prefix 
 * @param {*} suffix 
 * 
 * returns a uuid v4, and the prefix and suffix are injected
 */
const getRandomSalt = (prefix, suffix) => {
    if (!prefix) prefix = '';
    if (!suffix) suffix = '';

    return prefix + uuid() + suffix;
};


/**
 * initializes app with default variables
 */
const initApp = (appName) => {
    try {
        this.appName = appName ? appName : process.env.APP;
        var fileName = path.resolve(__dirname, '..') + '/logs/' + this.appName + '/logs.' + getNowObject(false, false) + '.txt';

        logger.init(fileName, config.EMAILS.ERROR, config.EMAILS.NO_REPLY, this.appName);
        logger.log('initializing app', '\n\n--Program Started--', '', 1, false);
    }
    catch (error) {
        logger.logError('initializing app', '', error, false);
    }
};


const isNullOrEmpty = val => {
    if (val != "" && val != undefined && val != null) {
        return val;
    } else
        return 0;
};


/**
 * 
 * @param {*} req 
 * by default returns a filter which gives data for last month
 */
const getDateWhereForLists = (req, dateFieldName, defaultPeriodUnit, defaultPeriod) => {
    let endDate = new Date();
    let unit = defaultPeriodUnit ? defaultPeriodUnit : 'month';
    let period = defaultPeriod ? defaultPeriod : -1;

    let startDate = dateAdd(endDate, unit, period);

    if (req.query && req.query.start && isValidDate(req.query.start)) startDate = new Date(req.query.start);
    if (req.query && req.query.end && isValidDate(req.query.end)) endDate = new Date(req.query.end);

    return {
        key: dateFieldName,
        value: startDate,
        value2: endDate,
        type: 'bt'
    };

};


//Commenting following block because we will be using aws's new tech to resize the images. Saving it for the future.

/**
 * 
 * @param {String} fileName The name of the file to be resized
 * @param {String} newFileName The name of the file to be saved as after resizing
 * @param {String} returnPath The path to be returned to be saved in DB so it can be referenced later on
 * 
 * 
 * returns a promise with either an error if rejects, or the file name when it is successful
 */
const resizeFile = (fileName, newFileName, returnPath) => {
    return new Promise((resolve, reject) => {
        jimp.read(fileName, function (err, lenna) {
            if (err) reject(err);
            lenna.resize(150, 150)
                .write(newFileName, () => {
                    // returns the new path
                    resolve(returnPath);
                });
        });
    });
};


const generateRandomCode = length => {
    const possible = "a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1";
    let text = '';

    for (let index = 0; index < length; index++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const generateRandomNumberCode = length => {
    const possible = "012368903476901254567856890356984467109812356735890125738729";
    let text = '';

    for (let index = 0; index < length; index++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


const drillDownErrorMessage = (error) => {
    var errorMessage = error.message;

    if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => {
            if (err.message) {
                errorMessage = errorMessage + '. ' + err.message;
            }
        });
    }

    return errorMessage;
};


const base64Decode = (textToDecode) => {
    return Buffer.from(textToDecode, 'base64').toString('utf8');
};


const isOprVerified = (opr) => {
    return config.OPR_KEY === opr;
};


const generateWarning = (message, code) => {
    const error = new Error(message);
    error.warning = true;
    code ? error.code = code : '';

    return error;
};


const generateError = message => {
    const error = new Error(message);
    error.fatal = true;
    error.code = 502;

    return error;
};

/**
 * 
 * @param {*} password the password which needs to be validated
 * 
 * returns a boolean confirming if the supplied password is a valid password or not. Ideally, the password should be minimum 8 characters and should consist 1 capital case, 1 lowe case letter, 1 number, and 1 special character
 */
const validatePassword = password => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return password.length > 7 && regex.test(String(password).toLowerCase());
};


/**
 * 
 * @param {String} type The type of call. It will be a string, the sample values are 'make_payment', 'login' etc
 * @param {Object} data the object where we need to search the required fields
 * @param {Object} res the response object to send the response
 */
const missingRequiredFields = (type, data, res) => {
    const fields = requiredFields[type];
    const invalidFields = [];

    if (fields) {
        if (Array.isArray(fields) && fields.length > 0) {
            // we got the array. Loop
            fields.forEach(field => {
                if (typeof data[field] === 'undefined' || data[field] === '') {
                    // bummer. We couldn't find the field or the data
                    invalidFields.push(field);
                }
                else {
                    // valid field.
                }
            });
        }
    }
    else {
        // couldn't find the type in config. Skipping
    }

    if (invalidFields.length > 0) {
        // send the error back
        // invalid fields found. Return and throw an error
        const error = generateWarning(`Invalid input provided. Fields - ${invalidFields.join(' ')} were not provided.`, codes.INPUT_INVALID);

        if (res) {
            // send the response
            responseHelper.error(res, error, error.code ? error.code : codes.ERROR, `Invalid fields in ${type} object`);
        }
        else {
            throw error;
        }
    }

    return '';
};

const jwtService = {
    _options: {
        issuer: config.JWT.ISSUER,
        audience: config.JWT.AUDIENCE,
        subject: config.JWT.SUBJECT,
    },


    createJWT: (objectToEncrypt, expiresIn) => {
        return jwt.sign(objectToEncrypt, privateKey,
            {
                ...this._options,
                algorithm: config.JWT.ALGORITHM,
                expiresIn
            });
    },


    verifyJWT: token => {
        try {
            return jwt.verify(token, publicKey, {
                ...this._options,
                algorithm: [config.JWT.ALGORITHM],
            });
        }
        catch (error) {
            return {
                error,
                isError: true
            };
        }
    },


    decode: token => {
        try {
            var decoded = jwt.decode(token, _options);
            return decoded;
        }
        catch (error) {
            return {
                error,
                isError: true
            };
        }
    }
};


const tokenIsValid = token => {
    const decoded = jwtService.verifyJWT(token);

    if (decoded.isError) {
        console.log('error in decoding token: ', token);
        if (decoded.error.name === 'TokenExpiredError') {
            decoded.error.code = codes.TOKEN_AUTH_EXPIRED;
        }
        else {
            decoded.error.code = codes.TOKEN_AUTH_CORRUPTED;
        }
    }


    // either true of the error
    return decoded;
};


const promiseRejectionHandler = (req, res, f) => {
    // since we are using Promises for testing, we need to wrap these up to ignore
    const promise = f(req, res);

    if (promise) {
        promise.then(result => {

        }).catch(error => {
            // just print for the sake of it
            console.log('error: ', error);
        });
    }
    else {
        // do nothing
    }
};


const generateUUID = () => {
    return uuid();
};


const oprMiddleware = (req, res) => {
    const token = req.headers['authorization'] || req.headers['x-access-token'] || req.headers['opr-key'] || req.body.oprKey || req.query.oprKey;

    console.log('opr key in util: ', req.headers['authorization'], req.headers['x-access-token']);

    if (!isOprVerified(token)) {
        // let's not throw the error here and let the normal course run through the process. May be, the user token is supplied for an open request.
        // responseHelper.unauthorized(res);

        return false;

    }

    req.oprRequest = true;

    return true;
};


const constructWheresForSequelize = (key, value, filter) => {

    return {
        key,
        type: 'eq',
        value,
        value2: ''
    };
};
const constructWheresForNotEqualSequelize = (key, value, filter) => {

    return {
        key,
        type: 'ne',
        value,
        value2: ''
    };
};

const constructWheresForbetweenSequelize = (key, value, value2, filter) => {

    return {
        key,
        type: 'bt',
        value,
        value2
    };
};


const convertEpochToDate = epoch => {
    const utcSeconds = googleWrapper.azp;
    const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    return date;
};


const isValidDate = dateToValidate => {
    return dateToValidate && (!(new Date(dateToValidate) == "Invalid Date") && !isNaN(new Date(dateToValidate)));
};


const getSpecialReward = email => {
    if (specialEmails.indexOf(email.toLowerCase()) > -1) {
        return 400;
    }
    return 0;
};


const calculateTax = amount => {
    console.log('amount for tax; ', amount);
    if (amount > 1000) {
        return 12;
    }

    return 5;
};


const assignHostNameToReq = req => {
    try {
        const origin = req.get('origin');
        console.log("origin : ", origin);
        console.log("process.env.DOMAIN_NOKIA : ", process.env.DOMAIN_NOKIA);
        if(process.env.DOMAIN_NOKIA === origin)
        {
            console.log("cs 1");
        }
        else
        {
            console.log("cs 2");
        }
        if (origin) {
            switch (origin) {
                case process.env.DOMAIN_NOKIA:
                    req.HostName = constants.NOKIA.HOST_NAME.NOKIA;
                   break;
            }
        }

        console.log(`assigning ${req.HostName} for ${origin} origin`);

    }
    catch (error) {
        // let's not make a fuss about it.
        console.log('error in assigning host name: ', error);
    }
};

const numberFormat = value => {
    new Intl.NumberFormat('en-IN', {
        // style: 'currency',
        // currency: 'INR' 
    }).format(value);
}



exports.dateAdd = dateAdd;
exports.getNowObject = getNowObject;
exports.base64Decode = base64Decode;
exports.drillDownErrorMessage = drillDownErrorMessage;
exports.isNullOrEmpty = isNullOrEmpty;
exports.initApp = initApp;
exports.getRandomSalt = getRandomSalt;
exports.isOprVerified = isOprVerified;
exports.generateWarning = generateWarning;
exports.generateError = generateError;
exports.validatePassword = validatePassword;
exports.missingRequiredFields = missingRequiredFields;
exports.jwtService = jwtService;
exports.tokenIsValid = tokenIsValid;
exports.convertEpochToDate = convertEpochToDate;
exports.promiseRejectionHandler = promiseRejectionHandler;
exports.oprMiddleware = oprMiddleware;
exports.constructWheresForSequelize = constructWheresForSequelize;
exports.generateRandomCode = generateRandomCode;
exports.generateRandomNumberCode = generateRandomNumberCode;
exports.isValidDate = isValidDate;
exports.generateUUID = generateUUID;
exports.getDateWhereForLists = getDateWhereForLists;
exports.getSpecialReward = getSpecialReward;
exports.setApp = setApp;
exports.calculateTax = calculateTax;
exports.assignHostNameToReq = assignHostNameToReq;
exports.resizeFile = resizeFile;
exports.constructWheresForNotEqualSequelize = constructWheresForNotEqualSequelize;
exports.constructWheresForbetweenSequelize = constructWheresForbetweenSequelize;
exports.numberFormat = numberFormat;
