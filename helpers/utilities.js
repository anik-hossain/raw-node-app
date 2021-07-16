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

module.exports = utilities;
