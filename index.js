/**
 * Title: Uptime Monitor Application
 * Description: A RestFull API to monitor up or down time of user provided links
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Dependencies
const http = require('http');
const envToExoport = require('./helpers/env');

// Custom Dependencies
const { handlerReqRes } = require('./helpers/handler');
const data = require('./lib/data');

// App Obeject Scaffolding
const app = {};

data.delete('', 'new', (err, data) => {
    console.log(err, data);
});

// Configuration
app.config = {
    port: 3000,
};

// Create Server
app.creaeteServer = () => {
    const server = http.createServer(app.handlerReqRes);
    server.listen(envToExoport.port, () => {
        console.log(`server started on port ${envToExoport.port}`);
    });
};

// Request Response Handler
app.handlerReqRes = handlerReqRes;

// Start the server
app.creaeteServer();
