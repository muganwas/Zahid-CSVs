'use strict';
module.exports = app => {
    const info = require('./controllers');
    app.route('/api/v1/saveCSV')
        .post(info.save)
        .get(info.retrieve);
    app.route('/api/v1/create-table')
        .post(info.createTable);
};
