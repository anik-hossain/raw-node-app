/**
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Modile Scalffolding
const handler = {}

handler.notFound = (requestProperties, clbk) => {
    console.log(requestProperties);
    clbk(404, {
        message: '404 Not Found'
    });
}

module.exports = handler;
