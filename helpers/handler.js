/**
 * Title: Request Response Handler
 * Description: A RestFull API to monitor up or down time of user provided links
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFound } = require('../handlers/routeHandlers/notFoundHandler')

// Module Scaffolding
const handler = {}

// Request Response Handler
handler.handlerReqRes = (req, res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedUrl = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let data = '';

    const requestProperties = {
        parsedUrl,
        path,
        trimmedUrl,
        method,
        queryString,
        headers
    }

    // Get request handler
    const getHandler = routes[trimmedUrl] ? routes[trimmedUrl] : notFound;

    getHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
        payload = typeof (payload) === 'object' ? payload : {}

        const payloadString = JSON.stringify(payload);

        // Return the response
        res.writeHead(statusCode);
        res.end(payloadString);
    })

    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    });

    req.on('end', () => {
        data += decoder.end();

        console.log(data);
    });
}

module.exports = handler;
