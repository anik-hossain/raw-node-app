/**
 * Title: Sample
 * Description: Sameple Handler
 * Author: Anik Hossain
 * Date: 7/14/2021
 */

// Modile Scalffolding
const handler = {}

handler.sampleHandler = (requestProperties, clbk) => {
    console.log(requestProperties);
    clbk(200, {
        message: 'Sample Url'
    });
};

module.exports = handler;
