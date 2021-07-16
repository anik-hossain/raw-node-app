/**
 * Title: User Handler
 * Description: User Handler
 * Author: Anik Hossain
 * Date: 7/15/2021
 */

// Dependencies
const { read, create, update } = require('../../lib/data');
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Modile Scalffolding
const handler = {};

handler.userHandler = (requestProperties, clbk) => {
    const ecceptedMethods = ['get', 'post', 'put', 'delete'];
    if (ecceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, clbk);
    } else {
        clbk(405);
    }
};

// User Scaffolding
handler._users = {};

handler._users.get = (requestProperties, clbk) => {
    // check user phone number valid or not
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        // Verify token
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;

        tokenHandler._token.verify(token, phone, (token) => {
            if (token) {
                // Find the user
                read('users', phone, (err, data) => {
                    const user = { ...parseJSON(data) };
                    if (!err && user) {
                        delete user.password;
                        clbk(200, user);
                    } else {
                        clbk(404, { error: '404 not found' });
                    }
                });
            } else {
                clbk(403, { error: 'Authenticaion failled' });
            }
        });
    } else {
        clbk(404, { error: '404 not found' });
    }
};
handler._users.post = (requestProperties, clbk) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 5
            ? requestProperties.body.password
            : false;

    const agreement =
        typeof requestProperties.body.agreement === 'boolean'
            ? requestProperties.body.agreement
            : false;

    if (firstName && lastName && phone && password && agreement) {
        // Make sure that user does't already exists
        read('users', phone, (err) => {
            if (err) {
                let userObjct = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    agreement,
                };

                // store user data to database
                create('users', phone, userObjct, (err) => {
                    if (!err) {
                        clbk(200, { message: 'User created successfully' });
                    } else {
                        clbk(500, { err: 'Server Side Error' });
                    }
                });
            } else {
                clbk(500, { err: 'Internal server side error' });
            }
        });
    } else {
        clbk(400, { error: 'Submit correct data' });
    }
};

handler._users.put = (requestProperties, clbk) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 5
            ? requestProperties.body.password
            : false;

    if (phone) {
        if (firstName || lastName || password) {
            // Verify token
            const token =
                typeof requestProperties.headers.token === 'string'
                    ? requestProperties.headers.token
                    : false;

            tokenHandler._token.verify(token, phone, (token) => {
                if (token) {
                    // Find the user
                    read('users', phone, (err, data) => {
                        const userData = { ...parseJSON(data) };
                        if (!err) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            // Update user
                            update('users', phone, userData, (err) => {
                                if (!err) {
                                    clbk(200, {
                                        message: 'User Upadate Successfully',
                                    });
                                } else {
                                    clbk(500, { error: 'Server side error' });
                                }
                            });
                        } else {
                            clbk(400, { error: 'Invalid phone number' });
                        }
                    });
                } else {
                    clbk(403, { error: 'Authenticaion failled' });
                }
            });
        } else {
            clbk(400, { error: 'Wrong input' });
        }
    } else {
        clbk(400, { error: 'Invalid phone number' });
    }
};

handler._users.delete = (requestProperties, clbk) => {
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        // Verify token
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;

        tokenHandler._token.verify(token, phone, (token) => {
            if (token) {
                // Find the user
                read('users', phone, (err) => {
                    if (!err) {
                        data.delete('users', phone, (err) => {
                            if (!err) {
                                clbk(200, 'User deleted successfully');
                            } else {
                                clbk(500, { error: 'Server side error' });
                            }
                        });
                    } else {
                        clbk(500, { message: 'Server side error' });
                    }
                });
            } else {
                clbk(403, { error: 'Authenticaion failled' });
            }
        });
    } else {
        clbk(400, { error: 'Invalid phone number' });
    }
};

module.exports = handler;
