'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /file
 */
module.exports = {
    /**
     * summary: Get file by path and name
     * description: 
     * parameters: status
     * produces: application/json
     * responses: 200, 400
     * operationId: getRepoFile
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/file',
                operation: 'get',
                response: '200'
            }, callback);
        },
        400: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/file',
                operation: 'get',
                response: '400'
            }, callback);
        }
    }
};
