const fp = require("fastify-plugin");
const crypto = require('crypto');
module.exports = fp(function (fastify, opts, next) {
    fastify.decorate("crypto", {
        crypto,
        randomHexString,
        saltString,
        saltPassword
    });
    next()
});

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const randomHexString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const saltString = function (string, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(string);
    var value = hash.digest('hex');
    return {
        salt: salt,
        hash: value
    };
};

const saltPassword = function (userpassword) {
    var salt = randomHexString(32); /** Gives us salt of length 16 */
    return saltString(userpassword, salt);
}
