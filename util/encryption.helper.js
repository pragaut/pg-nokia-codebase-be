const crypto = require('crypto');
const config = require('../config').config;


const encryptTextWithKey = (textToEncrypt, keyTobeUsedInEncryption) => {
    const buffer = new Buffer(textToEncrypt,'utf8')
    const cipher = crypto.createCipheriv('aes-256-ecb', keyTobeUsedInEncryption, new Buffer(0));
    let encrypted = cipher.update(buffer, 'utf8', 'base64');
    encrypted = encrypted + cipher.final('base64');
    return encrypted;
};


const decryptTextWithKey = (textToDecrypt, keyTobeUsedInDecryption) => {
    const buffer = new Buffer(textToDecrypt,'base64')
    const decipher = crypto.createDecipheriv('aes-256-ecb', keyTobeUsedInDecryption, new Buffer(0));
    let decrypted = decipher.update(buffer, 'base64', 'utf8');
    decrypted = decrypted + decipher.final('utf8');
    return decrypted;
};


const encryptText = textToEncrypt => {
    return encryptTextWithKey(textToEncrypt, config.ENCRYPTION_KEY);
};


const decryptText = textToDecrypt => {
    return decryptTextWithKey(textToDecrypt, config.ENCRYPTION_KEY);
};


/**
 * 
 * @param {String} password the password to be encrypted
 * 
 * This function will generate a random salt, and will encrypt the password using that salt
 * 
 *  @returns: {
 *      password,
 *      salt
 *  }
 */
const hashPassword = (password, salt) => {
    if(!salt) salt = randomBytes(16);
    var hashedPassword = crypto.pbkdf2Sync(password, salt, config.PASSWORD_ITERATIONS, 25, 'sha512');

    return {
        password: hashedPassword.toString('hex'),
        salt
    };
};


const randomBytes = (len, encoding) => {
    return crypto.randomBytes(len).toString(encoding ? encoding : 'hex');
};


const validatePassword = (attemptedPassword, hashedPassword, salt) => {
    //console.log("hashPassword(attemptedPassword, salt).password : " ,hashPassword(attemptedPassword, salt).password);
    //console.log("before password match : ", attemptedPassword)
    return hashPassword(attemptedPassword, salt).password === hashedPassword;
} 


const md5 = (textToHash) => {
    return crypto.createHash('md5').update(textToHash).digest("hex");
};


module.exports.hashPassword = hashPassword;
module.exports.validatePassword = validatePassword;
module.exports.encryptText = encryptText;
module.exports.decryptText = decryptText;
module.exports.encryptTextWithKey = encryptTextWithKey;
module.exports.decryptTextWithKey = decryptTextWithKey;
module.exports.randomBytes = randomBytes;
module.exports.md5 = md5;