/**
 * Title: Uptime Monitor Application
 * Description: A RestFull API to monitor up or down time of user provided links
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Dependencies
const http = require('http');

// Custom Dependencies
const { handlerReqRes } = require('./helpers/handler');

// App Obeject Scaffolding
const app = {}

// Configuration
app.config = {
    port: 3000
}

// Create Server
app.creaeteServer = () => {
    const server = http.createServer(app.handlerReqRes);
    server.listen(app.config.port, () => {

        console.log(`server started on port ${app.config.port}`);
    });
}

// Request Response Handler
app.handlerReqRes = handlerReqRes;

// Start the server
app.creaeteServer();
