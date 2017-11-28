'use strict';
var dataProvider = require('../data/save.js');
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
     */
    put: function saveToRepo(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['put']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
