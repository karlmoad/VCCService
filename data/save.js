'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /save
 */
module.exports = {
    /**
     * summary: save a file and record the changes in the history chain
     * description: 
     * parameters: body
     * produces: application/json
     * responses: 200, 400
     * operationId: saveToRepo
     */
    put: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/save',
                operation: 'put',
                response: '200'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/save',
                operation: 'put',
                response: '400'
            }, callback);
        }
    }
};
