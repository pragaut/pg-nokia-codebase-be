const fso = require('fs'); //file system object to operate through the log files
const config = require('../config').config;
const fileHelper = require('./file.helper');
const email = require('./email');
const util = require('.');
const path = require('path');

_fileName = '';
_from = '';
_emails = '';
logs = '';
logCounter = 0;

_previousDayLogged = -1; //we want to make sure that it will make the log file each day. We need to create the log file on the basis of the day which was being logged previously. If there is a change in the day number, then we need to create a new log file.

initialized = false;
_appName = '';

_appNameForFile = ''; // suppose if we fire a request for payment, it is important to know that request was made for shopping/coaching. So appName will keep on changing in that case, however, for the log file, we need to keep a name 'payment' so we can identify payment logs separately. Hence, this variable is required

// init will store the basic configurables like admin emails of fileName of the log file. The emails will be a comma separated emails which will blast the mail to each one in the string. Email from will be used to send it to client while sending email. It will be the email which receiver will send the reply to

const init = (fileName, emails, emailFrom, appName) => {
    this._fileName = fileName;
    this._emails = emails;
    this._from = emailFrom;
    this._appName = appName ? appName : process.env.APP;
    this._appNameForFile = this._appName;
};


const getEmailObject = (subject, content) => {
    return {
        to: this._emails === '' ? config.ADMIN_EMAIL : this._emails,
        from: this._from === '' ? config.ADMIN_EMAIL : this._from,
        subject: 'Log Email - ' + subject,
        content
    };
};


const setApp = appName => {
    this.appName = appName;
};


/**
 * we are now going to check here if we are logging for the same day, if not, then let's create the log for 
 * today, it will help us segregate the 
 */

const generateFileName = () => {
    const today = new Date().getDate();

    if ( today != this._previousDayLogged) {
        this._fileName = path.resolve(__dirname, '..') + '/logs/' + this._appNameForFile + '/logs.' + util.getNowObject(false, false) + '.txt';
        this._previousDayLogged = today;
    }
};


// This function will enter logs into the log file, with the current timestamp. if sendEmail is sent as true, it will send this message as email to the emails mentioned in the email variable set while initializing this object. Also, I have tried to introduce a new concept called Log Level. Sometimes we need very thorough logging, for example very detailed log, each and every step. I will call it a level 5. Sometimes I need bare minimum logs, which are considered a level 1. So I will now send a level with each log, which will tell this program that what level of log this is. With the help of a pre defined value somewhere in constant class, then we can easily decide as to which log we are currently needing to print. 

const log = (source, text, path, logLevel, sendEmail) => {
    //don't process if the log level is set to use a lessor logging mechanism. 
    const newLog = text + ' | Request Originated from ' + source + ' | App: ' + this._appName + ' |Logged at ' + util.getNowObject(true, true) + '\n';

    // let's generate a filename if required
    generateFileName();

    if (logLevel > config.LOG_LEVEL) {
        //no need to log if the logging level is set to a lessor value. 
        return;
    }

    if (path === '') {
        path = this._fileName;
    }


    if (config.USEQ) {
    /** will be using the following code when we will implement the queue for logging */
    //     /**
    //      * Please note that in order to consume the queue, you will need to implement a node based redis queue separately which will consume this. If useQ is false, it will send email instantly. Queuing is generally a part of bigger platform
    //      * 
    //      */

    //     //send it to queue
    //     queue.createQueue('log.boilerplate', {
    //         log: text,
    //         path: path,
    //         logLevel: logLevel,
    //         logsToAccumulate: config.LOGS_TO_ACCUMULATE
    //     });

    //     // check for email too.

    //     var data = module.exports.getEmailObject('Log Email', newLog);
    //     queue.createQueue('email.boilerplate', data);
    }
    else {
        // create the log file if it doesn't exist
        
        fileHelper.checkFileExists(path).then(exists => {
            if (!exists) {
                //create the file
                var stream = fso.createWriteStream(path);

                stream.write('Log File - Audit Platform | created at ' + util.getNowObject(true, false) + ' \n\n ');
                stream.close();

                // hold for half a milisecond so we get the time to create a new file. I don't want to jump to enter the log information until the file has been created.
                setTimeout(function () {
                    // wait :)
                    fso.appendFile(path, newLog, () => {});
                }, 500);
            }
            else {
                fso.appendFile(path, newLog, () => {});
            }
        });
    }

    // now we need to check if we have to send an email or not.
    if (sendEmail) {
        const data = getEmailObject('Log Email', newLog);
        email.sendEmail(data.to, '', data.subject, data.content);
    }
};


// When we receive any error in code, it will log into the log file, with the current timestamp. if sendEmail is sent as true, it will send this error as email to the emails mentioned in the email set while initializing this object

const logError = (source, logFilepath, error, sendEmail) => {
    let errorMessage = `\r\n Error found in ${process.env.MODE} mode. Details below: `;
    if (error.code) {
        errorMessage = '\r\n code is: ' + error.code;
    }

    if (source) {
        errorMessage = errorMessage + '\r\n Error Source: ' + source;
    }

    errorMessage = errorMessage + '\r\n \r\n Message: ' + error.message;

    if (error.stack) {
        errorMessage = errorMessage + '\r\n\r\n Stack: ' + error.stack;
    }

    log(source, errorMessage, logFilepath, 1, sendEmail);
};


module.exports.init = init;
module.exports.getEmailObject = getEmailObject;
module.exports.log = log;
module.exports.logError = logError;
module.exports.setApp = setApp;