const responseHelper = require('../response.helper');
const codes = require('../codes').codes;
const constants = require('../constants');
const util = require('../../util');
const request = require('request');
const template = require('../templates');
const smsConfig = require('./config');
const config = require('../../config').config;


const sendSMS = async (numbers, content) => {
    // To-do write the SMS service here, for now, just result true by default

    return true;
};


const sendOTP = async (numbers, code, otpTemplateName = 'OTP') => {

    /**
     * Let's hold the OTP for dev/staging if confirmed by config settings
     */

     console.log('numbers ===>', numbers, numbers === '', typeof numbers === 'undefined');

    if ((process.env.MODE !== 'production' && config.STAGING.SHOULD_SEND_OTP === false) || (!numbers || numbers === '' || numbers.trim().length === 0)) {
        // ok it is not prod or the number is not provided... let's not send the otp
        return { Status: "Success", Details: "1283j-321213-1231221-23133-11" }
    }


    let url = smsConfig.TwoFactor.URL_CUSTOM_TEMPLATE;
    url = url.replace('{phone_number}', numbers);
    url = url.replace('{otp}', code);
    url = url.replace('{template}', otpTemplateName);


    console.log('pushing url for sms: ', url);

    const promise = new Promise((resolve, reject) => {

        request.get(url, (error, response, body) => {
            if (error) {
                error.code = codes.PHONE_SENDING_ERROR;
                reject(error);
            }
            else {
                resolve(body);
            }
        });
    });

    const result = await promise;
    const resultObject = typeof result === 'string' ? JSON.parse(result) : result;

    if (resultObject.Status.toLowerCase() === 'error') {
        // error
        console.log('error while sending sms: ', resultObject);
        const error = util.generateWarning(result.Details, codes.PHONE_SENDING_ERROR);
        throw error;
    }

    return result;
};


const sendSMSWithTemplate = async (res, otpType, templateOptions, numbers, successMessage) => {

    try {
        console.log('precheck=>>', otpType, constants.TEMPLATES.TYPES.CHANGE_MOBILE);

        if (otpType === constants.TEMPLATES.TYPES.REGISTRATION.MOBILE || 
            otpType === constants.TEMPLATES.TYPES.PASSWORD.MOBILE || 
            otpType === constants.TEMPLATES.TYPES.OTP.OTHERS ||
            otpType === constants.TEMPLATES.TYPES.CHANGE_MOBILE_CONFIRM.MOBILE ||
            otpType === constants.TEMPLATES.TYPES.CHANGE_MOBILE.MOBILE|| 
            otpType === constants.TEMPLATES.TYPES.DEVICE_VERIFICATION.MOBILE||
            otpType === constants.TEMPLATES.TYPES.FREETRIAL_PASSWORD.MOBILE
            ) {
                
            // send otp with two factors and return;
            let otpTemplateName ="OTP";

            console.log('check : 1');
            
            const result = await sendOTP(numbers, templateOptions.otp,otpTemplateName);
    
            console.log('check 2: ', result);

            if (res) {
                console.log('check 3: ');
                responseHelper.success(res, codes.SUCCESS, [], successMessage);
            }
    
            console.log('check 4 ');
            return result;
        }
        else {
            console.log('check 11: ', numbers);
            const content = template.getTemplate(otpType, templateOptions);
            console.log('check 12: ', content);
            const result = await sendSMS(numbers, content);
            console.log('check 13: ', result);
    
            if (res) {
                responseHelper.success(res, codes.SUCCESS, [], successMessage);
            }
    
            return result;
        }
    }
    catch(error) {
        error.code = codes.PHONE_SENDING_ERROR;
        if (res) {
            responseHelper.error(res, error, error.code, 'Sending OTP');
        }
        else {
            throw error;
        }
    }
};

module.exports.sendSMS = sendSMS;
module.exports.sendSMSWithTemplate = sendSMSWithTemplate;