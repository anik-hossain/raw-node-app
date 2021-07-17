/**
 * Title: Token Handler
 * Description: Token related handler
 * Author: Anik Hossain
 * Date: 7/16/2021
 */

// Dependencies
const { read, create, update } = require('../../lib/data');
const data = require('../../lib/data');
const { hash, parseJSON, randomToken } = require('../../helpers/utilities');

// Modile Scalffolding
const handler = {};

handler.tokenHandler = (requestProperties, clbk) => {
    const ecceptedMethods = ['get', 'post', 'put', 'delete'];
    if (ecceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, clbk);
    } else {
        clbk(405);
    }
};

// Token Scaffolding
handler._token = {};

handler._token.get = (requestProperties, clbk) => {
    const token =
        typeof requestProperties.queryString.token === 'string'
            ? requestProperties.queryString.token
            : false;
    if (token) {
        // Find the Token
        read('tokens', token, (err, data) => {
            const token = { ...parseJSON(data) };
            if (!err && token) {
                clbk(200, token);
            } else {
                clbk(404, { error: '404 not found' });
            }
        });
    } else {
        clbk(404, { error: '404 not found' });
    }
};

handler._token.post = (requestProperties, clbk) => {
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
    if (phone && password) {
        // Find the user
        read('users', phone, (err, data) => {
            if (hash(password) === parseJSON(data).password) {
                const token = randomToken(20);
                const expires = Date.now() + 60 * 60 * 1000;

                const tokenObj = {
                    phone,
                    token,
                    expires,
                };

                // Store token to database
                create('tokens', token, tokenObj, (err) => {
                    if (!err) {
                        clbk(200, tokenObj);
                    } else {
                        clbk(500, { error: 'Server side error' });
                    }
                });
            } else {
                clbk(400, { error: 'username or password not correct' });
            }
        });
    } else {
        clbk(400, { err: 'Something not right to your request' });
    }
};

handler._token.put = (requestProperties, clbk) => {
    const token =
        typeof requestProperties.body.token === 'string' &&
        requestProperties.body.token
            ? requestProperties.body.token
            : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend
            ? requestProperties.body.extend
            : false;
    if (token && extend) {
        // Read the token file
        read('tokens', token, (err, data) => {
            let tokenobj = parseJSON(data);
            if (tokenobj.expires > Date.now()) {
                tokenobj.expires = Date.now() + 60 * 60 * 1000;

                // update the token expiry time
                update('tokens', token, tokenobj, (err) => {
                    if (!err) {
                        clbk(200, { message: 'Token updated' });
                    } else {
                        clbk(500, { error: 'Server side error' });
                    }
                });
            } else {
                clbk(400, { error: 'Token already expired' });
            }
        });
    } else {
        clbk(400, { error: 'Client side error' });
    }
};

handler._token.delete = (requestProperties, clbk) => {
    const token =
        typeof requestProperties.queryString.token === 'string' &&
        requestProperties.queryString.token
            ? requestProperties.queryString.token
            : false;
    if (token) {
        // Find the token
        read('tokens', token, (err) => {
            if (!err) {
                data.delete('tokens', token, (err) => {
                    if (!err) {
                        clbk(200, 'Token deleted successfully');
                    } else {
                        clbk(500, { error: 'Server side error' });
                    }
                });
            } else {
                clbk(500, { message: 'Server side error' });
            }
        });
    } else {
        clbk(400, { error: 'Invalid token' });
    }
};

handler._token.verify = (token, phone, clbk) => {
    read('tokens', token, (err, data) => {
        if (!err && data) {
            if (
                parseJSON(data).phone === phone &&
                parseJSON(data).expires > Date.now()
            ) {
                clbk(true);
            } else {
                clbk(false);
            }
        } else {
            clbk(false);
        }
    });
};

module.exports = handler;
