'use strict';
const data = require('../services/data');

module.exports = {
    save: async (req, res, next) => {
        try {
            res.json(await data.saveCSV(req.body));
        } catch (err) {
            console.error(`Error while posting quotes `, err.message);
            next(err);
        }
    },
    retrieve: async (req, res, next) => {
        try {
            res.json(await data.getMultiple(req.query.page));
        } catch (err) {
            console.error(`Error while getting quotes `, err.message);
            next(err);
        }
    },
    retrieveByAuthor: async (req, res, next) => {
        try {
            res.json(await data.getByAuthor(req.query.author));
        } catch (err) {
            console.error(`Error while getting quotes `, err.message);
            next(err);
        }
    },
    createTable: async (req, res, next) => {
        try {
            res.json(await data.createTable(req.body));
        } catch (err) {
            console.error(`Error while getting quotes `, err.message);
            next(err);
        }
    }
};