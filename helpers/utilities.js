/**
 *
 * Title: Utilities
 * Description: Importent utility  functions
 * Author: Anik Hossain
 * Date: 7/15/2021
 *
 */

// Dependencies
const crypto = require('crypto');
const environments = require('./env');

// Mudule Scaffolding
const utilities = {};

// Json to Object
utilities.parseJSON = (jsonString) => {
    let outupt;

    try {
        outupt = JSON.parse(jsonString);
    } catch (error) {
        outupt = {};
    }
    return outupt;
};

// Hash the string
utilities.hash = function (str) {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
    return false;
};

// Create random token
utilities.randomToken = (strLength = 0) => {
    let output = '';

    let length = typeof strLength === 'number' && strLength ? strLength : false;
    if (length) {
        let characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        for (let i = 0; i <= length; i++) {
            let randomChar = characters.charAt(
                Math.floor(Math.random() * characters.length + 1)
            );
            output += randomChar;
        }
        return output;
    }
    return false;
};

module.exports = utilities;
