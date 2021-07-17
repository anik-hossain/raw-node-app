/**
 * Title: Check Handler
 * Description: Check Handler
 * Author: Anik Hossain
 * Date: 7/16/2021
 */

// Dependencies
const { read, create, update } = require('../../lib/data');
const dataManagement = require('../../lib/data');
const { hash, parseJSON, randomToken } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/env');

// Modile Scalffolding
const handler = {};

handler.checkHandler = (requestProperties, clbk) => {
    const ecceptedMethods = ['get', 'post', 'put', 'delete'];
    if (ecceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, clbk);
    } else {
        clbk(405);
    }
};

// Check Scaffolding
handler._check = {};

handler._check.get = (requestProperties, clbk) => {
    // check user id valid or not
    const id =
        typeof requestProperties.queryString.id === 'string'
            ? requestProperties.queryString.id
            : false;
    // Find the check in database
    if (id) {
        // Read the check
        read('checks', id, (err, data) => {
            if (!err && data) {
                // Verify token
                const token =
                    typeof requestProperties.headers.token === 'string'
                        ? requestProperties.headers.token
                        : false;
                tokenHandler._token.verify(
                    token,
                    parseJSON(data).phone,
                    (isValidToekn) => {
                        if (isValidToekn) {
                            clbk(200, parseJSON(data));
                        } else {
                            clbk(403, {
                                error: 'Authentication failled',
                            });
                        }
                    }
                );
            } else {
                clbk(500, { error: 'Server side error' });
            }
        });
    } else {
        clbk(400, { error: 'Invalid check' });
    }
};

handler._check.post = (requestProperties, clbk) => {
    // Validation
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method)
            ? requestProperties.body.method
            : false;
    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeout =
        typeof requestProperties.body.timeout === 'number' &&
        requestProperties.body.timeout % 1 === 0 &&
        requestProperties.body.timeout >= 1 &&
        requestProperties.body.timeout <= 5
            ? requestProperties.body.timeout
            : false;

    if (protocol && url && method && successCodes && timeout) {
        // Verify token
        const token =
            typeof requestProperties.headers.token === 'string'
                ? requestProperties.headers.token
                : false;
        // Find the user by reading token
        read('tokens', token, (err, data) => {
            if (!err && data) {
                let phone = parseJSON(data).phone;
                read('users', phone, (err, data) => {
                    if (!err && data) {
                        tokenHandler._token.verify(
                            token,
                            phone,
                            (isValidToekn) => {
                                if (isValidToekn) {
                                    let user = parseJSON(data);
                                    let userChecks =
                                        typeof user.checks === 'object' &&
                                        user.checks instanceof Array
                                            ? user.checks
                                            : [];
                                    if (userChecks.length < maxChecks) {
                                        let checkId = randomToken(20);
                                        let checkObj = {
                                            checkId,
                                            phone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeout,
                                        };

                                        // Create checks to database
                                        create(
                                            'checks',
                                            checkId,
                                            checkObj,
                                            (err) => {
                                                if (!err) {
                                                    // add check id to user
                                                    user.checks = userChecks;
                                                    user.checks.push(checkId);

                                                    // update user
                                                    update(
                                                        'users',
                                                        phone,
                                                        user,
                                                        (err) => {
                                                            if (!err) {
                                                                clbk(
                                                                    200,
                                                                    checkObj
                                                                );
                                                            } else {
                                                                clbk(500, {
                                                                    error: 'Server side error',
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    clbk(500, {
                                                        error: 'Server side error',
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        clbk(401, {
                                            error: 'User alredy reched max checks',
                                        });
                                    }
                                } else {
                                    clbk(403, {
                                        error: 'Authentication failled',
                                    });
                                }
                            }
                        );
                    } else {
                        clbk(404, '404 not found');
                    }
                });
            } else {
                clbk(403, { error: 'Authentication failled' });
            }
        });
    } else {
        clbk(400, { error: 'Invalid check' });
    }
};

handler._check.put = (requestProperties, clbk) => {
    const id =
        typeof requestProperties.body.id === 'string'
            ? requestProperties.body.id
            : false;
    // Validation
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method)
            ? requestProperties.body.method
            : false;
    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeout =
        typeof requestProperties.body.timeout === 'number' &&
        requestProperties.body.timeout % 1 === 0 &&
        requestProperties.body.timeout >= 1 &&
        requestProperties.body.timeout <= 5
            ? requestProperties.body.timeout
            : false;
    if (id) {
        if (protocol || url || method || successCodes || timeout) {
            // Read check from database
            read('checks', id, (err, check) => {
                console.log(err, check);
                if (!err && check) {
                    let checkObj = parseJSON(check);
                    // Verify token
                    const token =
                        typeof requestProperties.headers.token === 'string'
                            ? requestProperties.headers.token
                            : false;
                    tokenHandler._token.verify(
                        token,
                        checkObj.phone,
                        (isValidToekn) => {
                            if (isValidToekn) {
                                if (protocol) {
                                    checkObj.protocol = protocol;
                                }
                                if (url) {
                                    checkObj.url = url;
                                }
                                if (method) {
                                    checkObj.method = method;
                                }
                                if (successCodes) {
                                    checkObj.successCodes = successCodes;
                                }
                                if (timeout) {
                                    checkObj.timeout = timeout;
                                }

                                // update check
                                update('checks', id, checkObj, (err) => {
                                    if (!err) {
                                        clbk(200, {
                                            message: 'Updated successfully',
                                        });
                                    } else {
                                        clbk(500, {
                                            error: 'Server side error',
                                        });
                                    }
                                });
                            } else {
                                clbk(403, { error: 'Authentication failled' });
                            }
                        }
                    );
                } else {
                    clbk(500, { error: 'Server side error' });
                }
            });
        } else {
            clbk(400, { error: 'Bad Request' });
        }
    } else {
        clbk(400, { error: 'Bad request' });
    }
};

handler._check.delete = (requestProperties, clbk) => {
    // check user id valid or not
    const id =
        typeof requestProperties.queryString.id === 'string'
            ? requestProperties.queryString.id
            : false;
    // Find the check in database
    if (id) {
        // Read the check
        read('checks', id, (err, data) => {
            if (!err && data) {
                // Verify token
                const token =
                    typeof requestProperties.headers.token === 'string'
                        ? requestProperties.headers.token
                        : false;
                tokenHandler._token.verify(
                    token,
                    parseJSON(data).phone,
                    (isValidToekn) => {
                        if (isValidToekn) {
                            dataManagement.delete('checks', id, (err) => {
                                if (!err) {
                                    // read the user file
                                    read(
                                        'users',
                                        parseJSON(data).phone,
                                        (err, data) => {
                                            if (!err && data) {
                                                let userObj = parseJSON(data);
                                                let userChecks =
                                                    typeof userObj.checks ===
                                                        'object' &&
                                                    userObj.checks instanceof
                                                        Array
                                                        ? userObj.checks
                                                        : [];

                                                // Remove user check from user data
                                                let userCheckPosition =
                                                    userChecks.indexOf(id);

                                                if (userCheckPosition > -1) {
                                                    userChecks.splice(
                                                        userCheckPosition,
                                                        1
                                                    );
                                                    userObj.checks = userChecks;
                                                    update(
                                                        'users',
                                                        parseJSON(data).phone,
                                                        userObj,
                                                        (err) => {
                                                            if (!err) {
                                                                clbk(200, {
                                                                    message:
                                                                        'User checks updated',
                                                                });
                                                            } else {
                                                                clbk(500, {
                                                                    error: 'Server side error',
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    clbk(500, {
                                                        error: 'Something went wrong in server',
                                                    });
                                                }
                                            } else {
                                                clbk(404, {
                                                    error: 'User not found',
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    clbk(500, { error: 'Server side error' });
                                }
                            });
                        } else {
                            clbk(403, {
                                error: 'Authentication failled',
                            });
                        }
                    }
                );
            } else {
                clbk(500, { error: 'Server side error' });
            }
        });
    } else {
        clbk(400, { error: 'Invalid check' });
    }
};

module.exports = handler;
