'use strict';
const data = require('../services/data');

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
            res.json(await data.getMultiple(req.query.page));
        } catch (err) {
            next(err);
        }
    },
    retrieveByAuthor: async (req, res, next) => {
        try {
            res.json(await data.getByAuthor(req.query.author));
        } catch (err) {
            next(err);
        }
    },
    createTable: async (req, res, next) => {
        try {
            res.json(await data.createTable(req.body));
        } catch (err) {
            if (err.message.includes('already exists')) {
                res.send(err.message);
            }
            else {
                next(err.message);
            }
        }
    }
};