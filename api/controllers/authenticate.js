var crypto = require('crypto');

var authenticate = {};
/**
https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
authenticate.genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
 authenticate.sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

authenticate.saltHashPassword = function(userpassword) {
    var salt = this.genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = this.sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
    return {
        salt:salt,
        password: passwordData
    };
}

exports.module = authenticate;
