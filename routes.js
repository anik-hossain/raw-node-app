/**
 * Title: Routes
 * Description: Application Routes
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
