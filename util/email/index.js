const nodemailer = require('nodemailer');
const codes = require('../codes').codes;
const constants = require('../constants');
const config = require('../../config').config;
const responseHelper = require('../response.helper');
const template = require('../templates');

const fetch = require('../fetch');

let transporter = {};

const mailWrapper = {
    initiated: false,
    transporter
};


const sendEmail_ses = async mailOptions => {

    let sendEmailTo = mailOptions.to;

    if (process.env.MODE === 'dev' || process.env.MODE === 'development') {
        sendEmailTo = 'pardeepbhardwaj10@gmail.com,sjaswant98@gmail.com';
    }

    const emailData = {
        to: sendEmailTo ? sendEmailTo.split(',') : [],
        cc: mailOptions.cc ? mailOptions.cc.split(',') : [],
        subject: mailOptions.subject,
        html: mailOptions.html,
    };

    if (!(process.env.MODE === 'dev' || process.env.MODE === 'development')) {
        emailData.to.push('pragauttechnologies@gmail.com');
        emailData.to.push('pardeepbhardwaj10@gmail.com');
        emailData.to.push('jaswant.official94@gmail.com');
    }


    const emailURL = process.env.EMAIL_URL + constants.END_POINTS.EmailWithGmail;  //constants.END_POINTS.EMAIL;
    //console.log("emailURL : ", emailURL);
    return await fetch.get(emailURL, {
        method: 'POST',
        body: JSON.stringify(emailData)
    });
};

module.exports.init = () => {

    // nodemailer.createTransport({
    //     SES: new aws.SES({ apiVersion: "2010-12-01" })
    // });

    mailWrapper.initiated = true;
};

/**
 * @param {String} to the {comma separated} email addresses to be included in To
 * @param {String} cc the {comma separated} email addresses to be included in cc
 * @param {String} subject subject of email
 * @param {String} html html body
 * @param {Array} attachments attachments to be included
 */
const sendEmail = async (to, cc, subject, html, attachments) => {
    const mailOptions = {
        to,
        cc,
        subject,
        html,
        attachments
    };

    try {
        return await sendEmail_ses({
            to, cc, subject, html, attachments
        });
    }
    catch (error) {
        error.code = codes.EMAIL_SENDING_ERROR;
        throw error;
    }
};


const sendEmailWithTemplate = async (res, emailType, templateOptions, to, successMessage) => {
    try {
        console.log('d: ', emailType);
        /**
         * let's not send otp emails for staging or dev
         */
        let cc = undefined;
        if (process.env.MODE !== 'production' && config.STAGING.SHOULD_SEND_EMAIL === false) {
            // ok it is not prod, let's not send OTP
            if (res)
                return responseHelper.success(res, codes.SUCCESS, [], successMessage);
            else
                return { success: true };

        }

        if (process.env.MODE !== 'production') {
            to = 'pardeepbhardwaj10@gmail.com,sjaswant98@gmail.com';
            cc = 'gautam.luhach@gmail.com';
        }


        // The following method will get the contents for the email along with subject.
        const emailData = template.getTemplate(emailType, templateOptions);
        const emailResult = await sendEmail(to, cc, emailData.subject, emailData.body);

        if (res) {
            responseHelper.success(res, codes.SUCCESS, [], successMessage);
        }

        return emailResult;
    }
    catch (error) {
        error.code = error.code ? error.code : codes.ERROR;

        if (res) {
            responseHelper.error(res, error, error.code, 'Sending Email');
        }
        else {
            throw error;
        }
    }
};


const sendEmailWithTemplateWithCC = async (res, emailType, templateOptions, to, cc, successMessage) => {
    try {
        console.log('d: ', emailType);
        /**
         * let's not send otp emails for staging or dev
         */
        if (process.env.MODE !== 'production' && config.STAGING.SHOULD_SEND_EMAIL === false) {
            // ok it is not prod, let's not send OTP
            if (res)
                return responseHelper.success(res, codes.SUCCESS, [], successMessage);
            else
                return { success: true };

        }

        if (process.env.MODE !== 'production') {
            to = 'pardeepbhardwaj10@gmail.com';
            cc = 'jaswant.official94@gmail.com';
        }


        // The following method will get the contents for the email along with subject.
        const emailData = template.getTemplate(emailType, templateOptions);
        const emailResult = await sendEmail(to, cc, emailData.subject, emailData.body);

        if (res) {
            responseHelper.success(res, codes.SUCCESS, [], successMessage);
        }

        return emailResult;
    }
    catch (error) {
        error.code = error.code ? error.code : codes.ERROR;

        if (res) {
            responseHelper.error(res, error, error.code, 'Sending Email');
        }
        else {
            throw error;
        }
    }
};

module.exports.sendEmail = sendEmail;
module.exports.sendEmailWithTemplate = sendEmailWithTemplate;
module.exports.sendEmailWithTemplateWithCC = sendEmailWithTemplateWithCC;
module.exports.mailWrapper = mailWrapper;

this.init();