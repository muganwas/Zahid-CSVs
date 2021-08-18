'use strict';
module.exports = {
    save: async (req, res, next) => {
        try {
            res.json(await data.saveCSV(req.body));
        } catch (err) {
            next(err.message);
        }
    },
    retrieve: async (req, res, next) => {
        try {
            res.json(await data.retrieveData(req.query.page));
        } catch (err) {
            next(err.message);
        }
    },
    retrieve: async (req, res) => {

    }
};