'use strict';
var dataProvider = require('../data/file.js');
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
     */
    get: function getRepoFile(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
